(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const guides = {
    p01: ['負の点数や 0 を含む合計。', '1 個だけの負の値を、そのまま出力できるか。', '合計が 32 ビット整数の上限を超えても正しく計算できるか。'],
    p02: ['1 から 5 までの和は 15。', '最小の N = 1 でも式が成り立つか。', 'N = 10 億の大きな積を、速く正確に計算できるか。'],
    p03: ['1 + 6 と 3 + 4 の 2 組を数える。', 'カードが 1 枚なら 2 枚は選べない。同じカードを 2 回使わず、0 を返すか。', '同じ値のカード 5 枚も別々に扱う。5 × 4 ÷ 2 = 10 組を、重複なく数えられるか。'],
    p04: ['同じ値も残して並べ替え、3 番目を選ぶ。', '要素が 1 個で負の値でも正しく取り出せるか。', 'K = N のとき、最後の要素（最大値）を取り出せるか。'],
    p05: ['出現回数が同じなら小さい値を選ぶ。', '要素が 1 個で負の値でも、回数 1 と答えられるか。', 'すべて同じ値のとき、5 回すべてを数えられるか。'],
    p06: ['負の値を含む区間や、長さ 1 の区間を求める。', '要素が 1 個の同じ区間を、複数回質問しても正しいか。', '区間の合計が 32 ビット整数の上限を超えても正しいか。'],
    p07: ['同じ値が並ぶとき、最初の位置を返す。', '条件を満たす値がなければ、配列の長さ N を返すか。', '先頭から条件を満たすとき、添字 0 を返すか。'],
    p08: ['合計が予算以下になる、最長の連続区間を探す。', '予算も全要素も 0 のとき、全体の長さ 4 を返すか。', 'どの要素も予算を超えるとき、長さ 0 と答えられるか。'],
    p09: ['終了時刻と次の開始時刻が同じ予定も選べる。', '予定が 1 個だけなら、1 個選べるか。', 'すべての予定が重なるとき、選ぶ数を 1 にできるか。'],
    p10: ['複数の経路から、最短の道の本数を求める。', '出発点と目的地が同じなら、距離 0 と答えるか。', '目的地につながる道がなければ、−1 と答えるか。'],
    p11: ['孤立した頂点も 1 グループとして数える。', '頂点が 1 個・辺が 0 本でも、1 グループと数えるか。', '輪になったグラフで無限に探索せず、1 グループと数えるか。'],
    p12: ['1 つ先・2 つ先への移動から、安い経路を選ぶ。', '足場が 1 個なら、ジャンプ不要で費用 0 と答えるか。', 'すべて同じ高さなら、合計費用 0 と答えるか。']
  };
  function highlight(code, lang) {
    const grammar = window.Prism?.languages[lang];
    return grammar ? Prism.highlight(code, grammar, lang) : escape(code);
  }
  function caseExplanation(id, index) { return guides[id]?.[index] || '入力に対する出力が、期待する答えと一致するか確認します。'; }
  function testGuide(p) {
    return `<aside class="test-guide"><h3>追加ケースのテストとは？</h3><p>サンプル以外の入力でも、正しい答えが出るか確かめるテストです。<strong>入力データと、正しい答え（期待出力）の 1 組</strong>を「1 ケース」と呼びます。</p><p>「3 ケースで判定」は、<strong>サンプル 1 件 ＋ 追加 2 件</strong>を順番に実行します。上の標準入力を書き換えても、この 3 件は変わりません。</p><ul>${p.tests.slice(1).map((t,i)=>`<li><b>追加ケース ${i+1}</b><span>${escape(caseExplanation(p.id,i+1))}</span></li>`).join('')}</ul><a class="small-link" href="#test-case-details" id="show-test-cases">入力と期待出力を見る ↓</a><p class="test-legend"><span>AC = 期待出力と一致</span><span>WA = 出力が不一致</span><span>CE / RE = コンパイル・実行エラー</span></p></aside>`;
  }
  const questions = new Map();
  const replies = new Map();
  const conversations = new Map();
  const jobs = new Map();
  const bridge = 'http://127.0.0.1:49173';
  let sessionToken = '';
  let connecting = null;
  let getContext = () => null;

  function renderAnswer(text) {
    return String(text).split(/(```[\s\S]*?```)/g).map(part => {
      if (!part.startsWith('```')) return `<div class="answer-prose">${escape(part.trim()).replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/^#{1,4} (.+)$/gm,'<h4>$1</h4>')}</div>`;
      const block = /^```([^\n]*)\n([\s\S]*?)```$/.exec(part);
      if (!block) return `<div class="answer-prose">${escape(part)}</div>`;
      const language = ({ruby:'ruby',rb:'ruby',csharp:'csharp','c#':'csharp',cs:'csharp'})[block[1].trim().toLowerCase()];
      return `<pre class="answer-code"><code>${language ? highlight(block[2],language) : escape(block[2])}</code></pre>`;
    }).join('');
  }
  function assistantMarkup(key) {
    return `<details class="assistant-panel" id="codex-assistant"><summary><span class="assistant-mark">✦</span><span><strong>AI に解説・質問</strong><small>この画面で質問して、続けて聞ける</small></span><span class="assistant-model">Sol 6.1</span></summary><div class="assistant-body"><p>この PC の Codex に質問を送り、回答をここに表示します。ChatGPT のログインを使うので、API キーは不要です。</p><div class="assistant-presets"><button type="button" data-ai-question="このコードを、処理の流れに沿って初心者にもわかるように解説してください。">コードを解説</button><button type="button" data-ai-question="答えを全部見せずに、次に考えることをヒントで教えてください。">ヒントを教えて</button><button type="button" data-ai-question="この問題を解答してください。考え方、選択中の言語でそのまま提出できるコード、計算量を説明してください。">解答と解説</button><button type="button" data-ai-question="実行結果やテスト結果を見て、間違いの原因と直し方を教えてください。">エラーを相談</button></div><label for="assistant-question">聞きたいこと</label><textarea id="assistant-question" rows="3" maxlength="4000" placeholder="例：なぜ j を i + 1 から始めるの？">${escape(questions.get(key) || 'この問題を解答してください。考え方、選択中の言語でそのまま提出できるコード、計算量を説明してください。')}</textarea><p class="assistant-context">現在の問題・言語・コード・標準入力・実行結果と、直近の会話を添えます。</p><div class="assistant-actions"><button type="button" id="ask-codex" class="btn">Sol 6.1 に質問する</button><button type="button" id="cancel-codex" class="btn btn-secondary" hidden>生成を中止</button><button type="button" id="clear-codex" class="btn btn-secondary">会話をリセット</button></div><p id="assistant-status" class="assistant-status" role="status">質問ボタンを押すと Sol 6.1 が回答します。</p><details class="assistant-setup"><summary>接続方法・うまく動かないとき</summary><p>この PC で接続プログラムの <b>Start.cmd</b> を開いておきます。ブラウザーにこの PC への接続確認が表示されたら許可してください。PC を再起動した後は、Start.cmd をもう一度開いてください。</p><a class="small-link" href="downloads/AlgoDojo-Codex-Windows.zip" download>Windows 接続プログラムをダウンロード</a><p>Codex CLI と Node.js が必要です。利用上限はログイン中の ChatGPT アカウントに従います。</p></details><details class="prompt-details"><summary>送る内容を確認</summary><textarea id="assistant-prompt" readonly aria-label="Codexへ渡す質問文" spellcheck="false"></textarea><button type="button" id="copy-codex" class="btn btn-secondary">質問文をコピー</button></details><div id="codex-reply" class="codex-reply" aria-live="polite" ${replies.has(key)?'':'hidden'}><strong>Sol 6.1 の回答</strong><p id="codex-reply-question" class="reply-question"></p><div id="codex-reply-text">${renderAnswer(replies.get(key)||'')}</div><p class="reply-followup">続きは上の入力欄で質問できます。会話はこのページを再読み込みすると消えます。</p></div></div></details>`;
  }
  function snapshot() {
    const context = getContext();
    if (!context) return {available:false,message:'コードエディタのあるページを開いてください。'};
    return {...context,question:document.querySelector('#assistant-question')?.value || questions.get(context.key)||'',previousExplanation:replies.get(context.key)||''};
  }
  function prompt(context) {
    const history = conversations.get(context.key) || [];
    return [
      'AlgoDojo+ の学習を手伝ってください。日本語で、初心者にわかる具体例を使って答えてください。現在のコードは直接変更せず、質問に答えてください。',
      `今回の質問：${context.question.trim()}`,
      `対象：${context.title}\nページ：${context.url}\n言語：${context.language}`,
      context.statement ? `問題：\n${context.statement}\n制約：\n${context.constraints.join('\n')}\n入力・出力：\n${context.format}` : `学習内容：\n${context.intro || ''}`,
      `現在のコード：\n${context.code}`,
      `標準入力：\n${context.stdin}`,
      `実行結果（最後の実行時点。現在のコードと異なる場合があります）：\n${context.output}`,
      context.tests ? `用意されたテスト：\n${context.tests.map((t,i)=>`${i===0?'サンプル':`追加ケース ${i}`}：${t.purpose}\n入力：\n${t.input}\n期待出力：\n${t.output}`).join('\n')}` : '',
      context.results ? `テスト結果：\n${context.results}` : '',
      history.length ? `直近の会話：\n${history.map(turn=>`学習者：${turn.question}\nSol 6.1：${turn.answer}`).join('\n\n')}` : context.previousExplanation ? `前回の解説：\n${context.previousExplanation}` : ''
    ].filter(Boolean).join('\n\n');
  }
  function showReply(key) {
    if (getContext()?.key !== key || !document.querySelector('#codex-reply')) return;
    const answer = replies.get(key) || '';
    document.querySelector('#codex-reply').hidden = !answer;
    document.querySelector('#codex-reply-text').innerHTML = renderAnswer(answer);
    const history = conversations.get(key) || [];
    document.querySelector('#codex-reply-question').textContent = history.length ? `質問：${history[history.length-1].question}` : '';
  }
  function refreshAssistant() {
    const input = document.querySelector('#assistant-question');
    if (!input) return;
    const context = snapshot();
    if (!context.key) return;
    questions.set(context.key,input.value);
    const text = prompt(context);
    document.querySelector('#assistant-prompt').value = text;
    const job = jobs.get(context.key);
    const busy = Boolean(job?.busy);
    const button = document.querySelector('#ask-codex');
    button.disabled = busy || !input.value.trim() || text.length > 48000;
    button.textContent = busy ? 'Sol 6.1 が考えています…' : 'Sol 6.1 に質問する';
    document.querySelector('#cancel-codex').hidden = !busy;
    document.querySelector('#clear-codex').disabled = busy;
    document.querySelector('#assistant-status').textContent = text.length > 48000 ? '送る内容が長すぎます。会話をリセットするか、コード・質問を短くしてください。' : job?.status || '質問ボタンを押すと Sol 6.1 が回答します。';
    document.querySelector('#codex-assistant').setAttribute('aria-busy',String(busy));
  }
  async function request(endpoint, {method='GET',body,token=sessionToken}={}) {
    let response;
    try {
      response = await fetch(bridge+endpoint, {
        method, mode:'cors', credentials:'omit', cache:'no-store', targetAddressSpace:'loopback',
        headers:{'X-AlgoDojo-Client':'1',...(token?{'X-AlgoDojo-Session':token}:{}),...(body?{'Content-Type':'application/json'}:{})},
        ...(body?{body:JSON.stringify(body)}:{}), signal:AbortSignal.timeout(10000)
      });
    } catch {
      throw new Error('この PC の Codex に接続できません。接続プログラムの Start.cmd を開き、ブラウザーのこの PC への接続許可を確認して、もう一度質問してください。');
    }
    const data = await response.json();
    if (!response.ok) {
      if(response.status===401) sessionToken='';
      throw new Error(data.error || '接続に失敗しました。もう一度質問してください。');
    }
    return data;
  }
  async function connect() {
    if(sessionToken) return sessionToken;
    if(!connecting) connecting=request('/connect',{method:'POST',body:{},token:''}).then(data=>{
      if(data.model!=='gpt-6.1-sol'||typeof data.token!=='string'||! /^[a-f0-9]{64}$/.test(data.token))throw new Error('接続プログラムを最新版に更新してください。');
      sessionToken=data.token;return sessionToken;
    }).finally(()=>{connecting=null;});
    return connecting;
  }
  async function askCodex() {
    const context=snapshot();
    if(!context.key||!context.question.trim()||jobs.get(context.key)?.busy)return;
    const text=prompt(context);
    if(text.length>48000)return;
    const job={busy:true,cancelled:false,id:'',token:'',status:'この PC の Codex に接続しています…'};
    jobs.set(context.key,job);refreshAssistant();
    try{
      job.token=await connect();
      if(job.cancelled)return;
      const accepted=await request('/ask',{method:'POST',token:job.token,body:{prompt:text,requestId:crypto.randomUUID()}});
      job.id=accepted.id;
      if(job.cancelled){await request(`/jobs/${job.id}`,{method:'DELETE',token:job.token});return;}
      job.status='Sol 6.1 が回答を作成しています。通常は数秒〜1分ほどかかります。';refreshAssistant();
      const deadline=Date.now()+150000;
      while(!job.cancelled){
        if(Date.now()>deadline)throw new Error('回答を待つ時間を超えました。もう一度質問してください。');
        const result=await request(`/jobs/${job.id}`,{token:job.token});
        if(job.cancelled)return;
        if(result.state==='complete'){
          if(typeof result.answer!=='string'||!result.answer.trim())throw new Error('空の回答を受け取りました。もう一度質問してください。');
          replies.set(context.key,result.answer);
          const history=[...(conversations.get(context.key)||[]),{question:context.question,answer:result.answer}].slice(-6);
          while(history.length>1&&JSON.stringify(history).length>24000)history.shift();
          conversations.set(context.key,history);
          job.status='Sol 6.1 から回答が届きました。続けて質問できます。';showReply(context.key);break;
        }
        if(result.state==='failed')throw new Error(result.error||'回答を生成できませんでした。');
        if(result.state==='cancelled'){job.status='回答の生成を中止しました。';break;}
        await new Promise(resolve=>setTimeout(resolve,900));
      }
    }catch(error){
      if(!job.cancelled)job.status=error.message;
      if(job.id)request(`/jobs/${job.id}`,{method:'DELETE',token:job.token}).catch(()=>{});
    }finally{
      job.busy=false;
      if(job.cancelled)job.status='回答の生成を中止しました。';
      if(getContext()?.key===context.key)refreshAssistant();
    }
  }
  function bindAssistant(contextProvider) {
    getContext=contextProvider;
    const panel=document.querySelector('#codex-assistant');
    if(!panel)return;
    const question=document.querySelector('#assistant-question');
    const status=document.querySelector('#assistant-status');
    document.querySelectorAll('[data-ai-question]').forEach(button=>button.onclick=()=>{question.value=button.dataset.aiQuestion;refreshAssistant();question.focus();});
    question.addEventListener('input',refreshAssistant);
    panel.addEventListener('toggle',()=>{if(panel.open)refreshAssistant();});
    document.querySelector('#ask-codex').onclick=askCodex;
    document.querySelector('#cancel-codex').onclick=async()=>{
      const key=getContext()?.key;const job=jobs.get(key);if(!job?.busy)return;
      job.cancelled=true;job.status='生成を中止しています…';refreshAssistant();
      if(job.id){try{await request(`/jobs/${job.id}`,{method:'DELETE',token:job.token});}catch{job.status='接続が切れました。生成は最大 2 分で終了します。';}}
    };
    document.querySelector('#clear-codex').onclick=()=>{
      const key=getContext()?.key;if(!key||jobs.get(key)?.busy)return;
      conversations.delete(key);replies.delete(key);jobs.delete(key);showReply(key);refreshAssistant();question.focus();
    };
    document.querySelector('#copy-codex').onclick=async()=>{
      refreshAssistant();const field=document.querySelector('#assistant-prompt');
      try{await navigator.clipboard.writeText(field.value);status.textContent='質問文をコピーしました。';}
      catch{field.closest('details').open=true;field.focus();field.select();status.textContent='質問文を選択しました。Ctrl / ⌘ + C でコピーしてください。';}
    };
    showReply(getContext()?.key);refreshAssistant();
  }

  function registerTools() {
    const registry=document.modelContext;
    if(typeof registry?.registerTool!=='function') return;
    const lifecycle=new AbortController();
    const register=tool=>{try{Promise.resolve(registry.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
    register({name:'algodojo_get_learning_context',description:'Read the current AlgoDojo problem, editable code, language, standard input, last output, test cases, and learner question. No code execution or external calls.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>snapshot()});
    register({name:'algodojo_show_explanation',description:'Display an explanation supplied by Codex in the current AlgoDojo assistant panel. This does not generate an answer or execute code. Use the context key returned by algodojo_get_learning_context.',inputSchema:{type:'object',properties:{key:{type:'string'},explanation:{type:'string',maxLength:20000}},required:['key','explanation'],additionalProperties:false},execute:input=>{
      if(!input||typeof input.key!=='string'||typeof input.explanation!=='string'||!input.explanation.trim()||input.explanation.length>20000)throw new Error('key と空でない explanation（20,000 文字以内）が必要です。');
      const context=snapshot();
      if(!context.key||input.key!==context.key)throw new Error('表示中の問題または言語が変わりました。現在の内容を読み直してください。');
      replies.set(input.key,input.explanation);
      showReply(input.key);
      document.querySelector('#codex-assistant').open=true;
      refreshAssistant();
      return {displayed:true,key:input.key};
    }});
    window.addEventListener('pagehide',event=>{if(!event.persisted)lifecycle.abort();},{once:true});
  }
  window.AlgoDojoTools={highlight,caseExplanation,testGuide,assistantMarkup,bindAssistant,refreshAssistant};
  registerTools();
})();
