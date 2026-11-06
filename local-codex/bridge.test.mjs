import test from 'node:test';
import assert from 'node:assert/strict';
import {once, EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import http from 'node:http';
import {createBridge, startCodex, SITE_ORIGIN} from './bridge.mjs';

test('untrusted origins, missing headers, cross-session access, duplication and cancellation', async t => {
  let runs = 0;
  let resolveRun;
  let cancelled = false;
  const server = createBridge({port:0,runner:() => {
    runs++;
    return {promise:new Promise(resolve=>{resolveRun=resolve;}),cancel(){cancelled=true;resolveRun('stopped');}};
  }});
  server.listen(0,'127.0.0.1');await once(server,'listening');
  t.after(()=>{server.close();server.closeAllConnections();});
  const base=`http://127.0.0.1:${server.address().port}`;
  const call=(endpoint,{origin=SITE_ORIGIN,token='',method='GET',body,headers={}}={}) => fetch(base+endpoint,{
    method,headers:{Origin:origin,'X-AlgoDojo-Client':'1','Content-Type':'application/json',...(token?{'X-AlgoDojo-Session':token}:{}),...headers},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  assert.equal((await call('/connect',{method:'POST',origin:'https://unrelated.example',body:{}})).status,403);
  const wrongHost=await new Promise((resolve,reject)=>{
    const req=http.request(base+'/connect',{method:'POST',headers:{Host:'attacker.example',Origin:SITE_ORIGIN,'X-AlgoDojo-Client':'1','Content-Type':'application/json'}},res=>{res.resume();resolve(res.statusCode);});
    req.on('error',reject);req.end('{}');
  });
  assert.equal(wrongHost,403);
  assert.equal((await call('/connect',{method:'POST',headers:{'X-AlgoDojo-Client':''},body:{}})).status,403);
  const preflight=await call('/ask',{method:'OPTIONS'});
  assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),SITE_ORIGIN);
  assert.equal((await call('/ask',{method:'POST',body:{prompt:'question'}})).status,401);
  const connect=await call('/connect',{method:'POST',body:{}});
  const {token}=await connect.json();
  const {token:otherToken}=await (await call('/connect',{method:'POST',body:{}})).json();
  assert.equal((await call('/ask',{method:'POST',token,body:{prompt:'x'.repeat(48001),requestId:'q-1234567890123456789'}})).status,400);
  const question={prompt:'Explain the pair count.',requestId:'q-1234567890123456789'};
  const first=await call('/ask',{method:'POST',token,body:question});assert.equal(first.status,202);
  const {id}=await first.json();
  const repeated=await call('/ask',{method:'POST',token,body:question});assert.equal((await repeated.json()).id,id);assert.equal(runs,1);
  assert.equal((await call('/ask',{method:'POST',token,body:{...question,requestId:'q-2234567890123456789'}})).status,409);
  assert.equal((await call(`/jobs/${id}`,{token:otherToken})).status,404);
  assert.equal((await (await call(`/jobs/${id}`,{token})).json()).state,'running');
  resolveRun('5 × 4 ÷ 2 = 10');await new Promise(resolve=>setImmediate(resolve));
  const complete=await (await call(`/jobs/${id}`,{token})).json();assert.equal(complete.state,'complete');assert.equal(complete.answer,'5 × 4 ÷ 2 = 10');
  const second=await (await call('/ask',{method:'POST',token,body:{...question,requestId:'q-3234567890123456789'}})).json();
  assert.equal((await (await call(`/jobs/${second.id}`,{method:'DELETE',token})).json()).state,'cancelled');assert.equal(cancelled,true);
});

function fakeChild() {
  const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new PassThrough();
  child.kill=()=>{child.emit('close',1);};return child;
}
test('CLI receives questions via stdin, disables tools, and returns only a completed answer', async () => {
  const child=fakeChild();let invocation;let stdin='';
  child.stdin.on('data',data=>{stdin+=data;});
  const question='Explain this code: $(do-not-run) `do-not-run` <script>x</script>';
  const run=startCodex({executable:'codex.exe',cwd:'.',prompt:question,spawnProcess:(...args)=>{invocation=args;return child;}});
  assert.equal(invocation[2].shell,false);
  assert.equal(invocation[1][invocation[1].indexOf('-m')+1],'gpt-6.1-sol');
  assert.equal(invocation[1][invocation[1].indexOf('-s')+1],'read-only');
  assert.ok(invocation[1].includes('shell_tool'));assert.ok(invocation[1].includes('--ignore-user-config'));
  assert.ok(!invocation[1].some(arg=>arg.includes('do-not-run')));assert.ok(stdin.includes(question));
  assert.equal(invocation[2].env.OPENAI_API_KEY,undefined);
  const message=JSON.stringify({type:'item.completed',item:{type:'agent_message',text:'説明です。'}})+'\n';
  child.stdout.write(message.slice(0,13));child.stdout.write(message.slice(13));
  child.stdout.write('{"type":"turn.completed"}\n');child.emit('close',0);
  assert.equal(await run.promise,'説明です。');
});

test('incomplete CLI output cannot appear as a successful answer', async () => {
  const child=fakeChild();const run=startCodex({executable:'codex.exe',cwd:'.',prompt:'test',spawnProcess:()=>child});
  child.stdout.write(JSON.stringify({type:'item.completed',item:{type:'agent_message',text:'partial'}})+'\n');child.emit('close',1);
  await assert.rejects(run.promise,/回答を完了できませんでした/);
});
