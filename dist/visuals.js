(function () {
  const names = {binary:'二分探索',prefix:'累積和',sort:'挿入ソート',bfs:'幅優先探索（BFS）',dp:'動的計画法（DP）'};
  const cell = (v,i,cls='') => `<div class="v-cell ${cls}"><b>${v}</b><small>${i}</small></div>`;
  function binary(target) {
    const a=[2,5,8,12,16,23,38], frames=[];let l=0,r=a.length;
    const frame=(mid,text)=>({html:`<div class="visual-array">${a.map((v,i)=>cell(v,i,i===mid?'active':i<l||i>=r?'dim':'')).join('')}</div><div class="visual-caption">探索範囲 [${l}, ${r}) · 探す値 x = ${target}</div>`,text});
    frames.push(frame(-1,'昇順の配列から「x 以上になる最初の位置」を探します。左端 l = 0、右端 r = N とし、右端を含まない範囲で考えます。'));
    while(l<r){const m=Math.floor((l+r)/2);frames.push(frame(m,`中央 mid = ${m}、値は ${a[m]}。${a[m]<target?`${a[m]} < ${target} なので、mid 以前は候補から外せます。次は l = mid + 1。`:`${a[m]} ≥ ${target} なので、この位置も答えの候補。次は r = mid。`}`));if(a[m]<target)l=m+1;else r=m;}
    frames.push({html:`<div class="visual-array">${a.map((v,i)=>cell(v,i,i===l?'active':'dim')).join('')}</div><div class="visual-caption">l = r = ${l} · ${l===a.length?'該当する要素なし（N を返す）':`a[${l}] = ${a[l]}`}</div>`,text:`探索範囲が空になりました。答えは ${l}。${l===a.length?'すべての値が x より小さいため、配列の長さ N を返します。':'0 始まりの添字で、x 以上になる最初の位置です。'} 毎回、候補がほぼ半分になるので O(log N) です。`});return frames;
  }
  function prefix(){const a=[3,1,4,1,5],s=[0];const frames=[];const html=(n,query=false)=>`<div class="visual-array">${a.map((v,i)=>cell(v,i+1,query?(i>=1&&i<=3?'active':'dim'):i===n-1?'active':'')).join('')}</div><div class="visual-caption">元の配列（1 始まり）</div><div class="visual-array">${[0,1,2,3,4,5].map(i=>cell(i<s.length?s[i]:'–',`s[${i}]`,query?(i===1||i===4?'active':''):i===n?'active':'')).join('')}</div>`;
    frames.push({html:html(0),text:'s[0] = 0。s[i] は「先頭から i 個の合計」です。空の区間の合計を 0 にしておくと、左端が 1 の質問にも同じ式が使えます。'});
    for(let i=0;i<a.length;i++){s.push(s[i]+a[i]);frames.push({html:html(i+1),text:`s[${i+1}] = s[${i}] + a[${i+1}] = ${s[i]} + ${a[i]} = ${s[i+1]}。1 個ずつ合計を伸ばします。前処理は O(N) です。`});}
    frames.push({html:html(5,true),text:'2 番目から 4 番目の合計は s[4] − s[1] = 9 − 3 = 6。「4 個分の合計」から「最初の 1 個分」を取り除きます。どんな長さの区間も O(1) で答えられます。'});return frames;
  }
  function sort(){let a=[5,2,8,1,4];const frames=[];const f=(active,text)=>({html:`<div class="chart-bars">${a.map((v,i)=>`<div class="chart-bar ${active.includes(i)?'active':''}" style="height:${v*15+15}px">${v}</div>`).join('')}</div><div class="visual-caption">左側の整列済み部分に、次の値を差し込む</div>`,text});
    frames.push(f([0],'挿入ソートを見てみましょう。先頭の 1 個は整列済みとみなし、次の値を正しい位置まで左へ動かします。'));
    for(let i=1;i<a.length;i++){frames.push(f([i],`次は値 ${a[i]} を、左の整列済み部分へ入れます。`));let j=i;while(j>0&&a[j]<a[j-1]){const x=a[j],y=a[j-1];[a[j],a[j-1]]=[a[j-1],a[j]];frames.push(f([j-1,j],`${y} > ${x} なので交換。${x} を 1 つ左に移動します。`));j--;}}
    frames.push(f([0,1,2,3,4],'昇順になりました！ 挿入ソートは最悪 O(N²)。これは仕組みを学ぶ図解です。大きい配列の競技問題では、言語の標準ソートなど O(N log N) の方法を検討します。'));return frames;
  }
  function dp(){const h=[10,30,40,20],d=[0,null,null,null],frames=[];const f=(at,text)=>({html:`<div class="visual-caption">足場の高さ h[i]</div><div class="visual-array">${h.map((v,i)=>cell(v,i,i===at?'active':'')).join('')}</div><div class="visual-caption">ここまでの最小コスト dp[i]</div><div class="visual-array">${d.map((v,i)=>cell(v===null?'∞':v,i,i===at?'active':'')).join('')}</div>`,text});
    frames.push(f(0,'カエルは 1 つ先か 2 つ先へ跳べます。コストは高さの差の絶対値。dp[i] を足場 i までの最小コストとし、出発点 dp[0] = 0 にします。'));
    for(let i=1;i<h.length;i++){const one=d[i-1]+Math.abs(h[i]-h[i-1]),two=i>1?d[i-2]+Math.abs(h[i]-h[i-2]):Infinity;d[i]=Math.min(one,two);frames.push(f(i,i===1?`足場 1 へは 0 からだけ。dp[1] = 0 + |30 − 10| = 20。`:`足場 ${i} へは 1 つ前から ${d[i-1]} + |${h[i]} − ${h[i-1]}| = ${one}、2 つ前から ${d[i-2]} + |${h[i]} − ${h[i-2]}| = ${two}。小さい方の ${d[i]} を採用します。`));}
    frames.push(f(3,'答えは dp[3] = 30。0 → 1 → 3 と跳ぶと 20 + 10 = 30 です。各足場で 2 通りだけを調べるので O(N)。すべての経路を列挙する必要はありません。'));return frames;
  }
  function bfs(){const edges=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],pos=[[40,95],[150,40],[150,150],[280,40],[280,150],[390,95]],d=[0,-1,-1,-1,-1,-1],q=[0],frames=[];
    const f=(at,text)=>({html:`<svg class="graph" viewBox="0 0 430 190" role="img" aria-label="6頂点の無向グラフ">${edges.map(([a,b])=>`<line class="edge" x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`).join('')}${pos.map(([x,y],i)=>`<circle class="node ${i===at?'current':d[i]>=0?'visited':''}" cx="${x}" cy="${y}" r="22"/><text x="${x}" y="${y+5}">${i+1}</text><text x="${x}" y="${y+38}" style="font-size:10px">距離 ${d[i]<0?'–':d[i]}</text>`).join('')}</svg><div class="visual-caption">キュー：${q.length?q.map(x=>x+1).join(' → '):'空'}（左から取り出す）</div>`,text});
    frames.push(f(0,'頂点 1 の距離を 0 としてキューに入れます。他は未訪問。重みのないグラフでは、近い頂点から順番に進めば最短距離が決まります。'));
    while(q.length){const v=q.shift(),newNodes=[];edges.forEach(([a,b])=>{const n=a===v?b:b===v?a:-1;if(n>=0&&d[n]===-1){d[n]=d[v]+1;q.push(n);newNodes.push(n+1);}});frames.push(f(v,`頂点 ${v+1} を取り出しました。${newNodes.length?`未訪問の ${newNodes.join('、')} に距離 ${d[v]+1} を設定してキューに追加。`:'隣の頂点はすべて訪問済みです。'} キューへ追加するときに訪問済みにすると、同じ頂点の重複追加を防げます。`));}
    frames.push(f(5,'探索終了。頂点 1 → 6 の最短距離は 3 辺です。各頂点・各辺を定数回ずつ調べるため O(V + E)。辺の重みが異なる場合は、この方法で最小コストを求められるとは限りません。'));return frames;
  }
  window.VISUAL_NAMES=names;
  window.createVisualizer=function(host,type='binary'){
    let index=0,timer=null,target=16;let frames;
    const stop=()=>{if(timer)clearInterval(timer);timer=null;};
    function build(){frames=type==='binary'?binary(target):type==='prefix'?prefix():type==='sort'?sort():type==='bfs'?bfs():dp();index=0;}
    function draw(){const f=frames[index];host.innerHTML=`<div class="visual-card"><div class="visual-toolbar"><h3>${names[type]}を、1 ステップずつ。</h3>${type==='binary'?`<label>探す値 x<input id="visual-target" type="number" min="-99" max="99" value="${target}"></label>`:'<span class="tag">動きを見て理解する</span>'}</div><div class="visual-stage">${f.html}</div><p class="visual-step-text" aria-live="polite">${f.text}</p><div class="visual-controls"><div class="control-buttons"><button data-v="reset" aria-label="最初のステップへ">↺</button><button data-v="prev" ${index===0?'disabled':''}>← 戻る</button><button data-v="play" class="primary">${timer?'一時停止':'▶ 再生'}</button><button data-v="next" ${index===frames.length-1?'disabled':''}>次へ →</button></div><span class="visual-progress">${String(index+1).padStart(2,'0')} / ${String(frames.length).padStart(2,'0')}</span></div></div>`;
      host.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{const action=b.dataset.v;if(action==='play'){if(timer){stop();draw();return;}if(index===frames.length-1)index=0;timer=setInterval(()=>{index++;if(index>=frames.length-1){index=frames.length-1;stop();}draw();},1900);draw();return;}stop();index=action==='reset'?0:action==='next'?Math.min(frames.length-1,index+1):Math.max(0,index-1);draw();});
      host.querySelector('#visual-target')?.addEventListener('change',e=>{stop();const value=Number(e.target.value);target=Number.isFinite(value)?Math.max(-99,Math.min(99,Math.trunc(value))):16;build();draw();});}
    build();draw();return {destroy:stop};
  };
})();
