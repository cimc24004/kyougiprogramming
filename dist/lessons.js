window.LESSONS = [
  {
    id: "io", title: "入力と出力", subtitle: "まずは、答えを正しく届けよう。", category: "基礎", level: "入門", minutes: 8, complexity: "O(入力の文字数)",
    intro: "競技プログラミングでは、標準入力から値を受け取り、計算結果だけを標準出力に書きます。最初の一歩は、2つの整数 A と B を読み込んで、その和を出すことです。",
    when: "すべての問題の出発点。入力の個数、型、改行の意味を問題文で確認します。",
    steps: ["入力例「3 5」を空白で分割すると、文字列の「3」と「5」になります。数として足すために整数へ変換します。", "Ruby の STDIN.read.split は入力全体を空白や改行で区切ります。C# も ReadToEnd と Split を使うと、複数行の整数を同じ方法で読めます。", "Ruby は puts、C# は Console.WriteLine で答えを出します。「答えは8です」のような説明文を出すと、期待する出力と一致しません。", "この例は入力が数値だけの場合のテンプレートです。空白を含む文章を読む問題では、行をそのまま読む方法に切り替えます。"],
    pitfalls: ["C# の int は約 ±21億まで。和や積が大きくなる問題では long を使い、掛け算する前から long にします。", "Ruby の整数同士の / は整数除算です。例えば 5 / 2 は 2。問題が整数を求めているか確認しましょう。"],
    ruby: `a, b = STDIN.read.split.map(&:to_i)
puts a + b`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        long a = long.Parse(t[0]);
        long b = long.Parse(t[1]);
        Console.WriteLine(a + b);
    }
}`,
    input: "3 5\n", output: "8\n", quiz: {question: "整数 A と B の和を出す問題。正しい出力はどれ？", options: ["8", "答えは8です", "A + B = 8"], correct: 0, explanation: "問題が求める値だけを出力します。デバッグ用の説明文は提出前に取り除きます。"}
  },
  {
    id: "complexity", title: "計算量を読む", subtitle: "書く前に、「間に合う」を考える。", category: "基礎", level: "入門", minutes: 12, complexity: "O(N)",
    intro: "計算量は、入力が大きくなったときに処理の回数がどう増えるかを表します。O(N) は N に比例、O(N²) は N の2乗に比例します。まず制約を読み、実行できそうな方法を選ぶ習慣をつけましょう。",
    when: "思いついた解法を実装する前。特に「全組合せを試す」方法が使えるか判断するときに役立ちます。",
    steps: ["この例は N 個の整数の合計です。要素を1つ読むたびに加算するので、加算回数はちょうど N 回です。", "N が2倍になると処理もおおむね2倍。これを O(N) と書きます。定数倍や小さな項は省き、増え方に注目します。", "N = 200,000 なら N² は400億です。二重ループで全組合せを調べる方針は見直す必要があります。一方、実際に間に合うかは言語、処理内容、制限時間にも依存します。", "時間だけでなくメモリも確認します。このコードは入力全体を保存するため、追加メモリは O(N) です。合計の変数だけなら O(1) ですが、入力処理も無視できません。"],
    pitfalls: ["ループが2つあっても、順番に1回ずつ実行するだけなら O(N + N) = O(N)。入れ子かどうかを見ましょう。", "「1秒で必ず何回」と固定して覚えないこと。実行環境や操作によって速度は変わります。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]
sum = 0
n.times do |i|
  sum += data[i + 1]
end
puts sum`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long sum = 0;
        for (int i = 0; i < n; i++) sum += long.Parse(t[i + 1]);
        Console.WriteLine(sum);
    }
}`,
    input: "5\n3 1 4 1 5\n", output: "14\n", quiz: {question: "N 回のループを終えてから、もう一度 N 回ループする計算量は？", options: ["O(N²)", "O(N)", "O(log N)"], correct: 1, explanation: "合計2N回なので O(N) です。N回の処理の内側で毎回N回繰り返す場合が O(N²) です。"}
  },
  {
    id: "brute", title: "全探索", subtitle: "小さい問題は、全部試せばいい。", category: "アルゴリズム", level: "初級", minutes: 12, complexity: "O(N²)",
    intro: "全探索は、答えになりうる候補をすべて調べる方法です。まずは正しい素直な解法を作る力が大切。この例では、異なる2つの位置 i < j を選び、A[i] + A[j] = X となる組を数えます。",
    when: "N が小さく全候補を調べられるとき。高速な解法と小さい入力で答えを比較するためにも使えます。",
    steps: ["最初の位置 i を 0 から N−1 まで選びます。配列の添字は0始まりです。", "次の位置 j は i+1 から始めます。これで同じ位置を選ばず、(i, j) と (j, i) の二重カウントも防げます。", "2つの値の和が X と等しいときだけ答えを1増やします。同じ値でも位置が違えば別の組です。", "候補は N(N−1)/2 組なので O(N²)。例えば N ≤ 2,000 なら候補は約200万組ですが、N = 200,000 なら別の方法を考えます。"],
    pitfalls: ["j を 0 から始めると、同じ組を2度数えたり、自分自身と組にしたりします。", "組の数は値の大きさとは別に大きくなります。C# では答えを long にすると安心です。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, x = data[0, 2]
a = data[2, n]
answer = 0
n.times do |i|
  ((i + 1)...n).each do |j|
    answer += 1 if a[i] + a[j] == x
  end
end
puts answer`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long x = long.Parse(t[1]);
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = long.Parse(t[i + 2]);
        long answer = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (a[i] + a[j] == x) answer++;
        Console.WriteLine(answer);
    }
}`,
    input: "5 6\n1 2 3 4 5\n", output: "2\n", quiz: {question: "i < j だけを調べるのはなぜ？", options: ["配列をソートするため", "和を小さくするため", "同じ位置と重複した組を避けるため"], correct: 2, explanation: "i < j なら i と j は異なり、順番を入れ替えた同じ組も数えません。"}
  },
  {
    id: "sort", title: "ソート", subtitle: "並べ替えると、見えるルールがある。", category: "アルゴリズム", level: "初級", minutes: 10, complexity: "O(N log N)",
    intro: "ソートは値を小さい順や大きい順に並べる操作です。順序を整えるだけで、最小値、順位、隣り合う値の比較が簡単になります。この例では、N 個の整数のうち小さい方から K 番目の値を求めます。",
    when: "順番が変わっても答えに影響しない問題。順位、重複の整理、貪欲法や二分探索の準備に使えます。",
    steps: ["整数として読み込んだ配列を昇順にソートします。入力順が必要な問題では、元の位置も一緒に持つか、コピーを作ります。", "小さい順に並んだ配列では、先頭が1番目、添字1が2番目です。K 番目の値の添字は K−1 です。", "重複する値も別々に数えます。例えば [1, 1, 3] の2番目は1です。「異なる値の2番目」なら別の処理が必要です。", "一般的な比較ソートは O(N log N) を目安に考えます。問題の制約として 1 ≤ K ≤ N を確認しましょう。"],
    pitfalls: ["文字列のままソートすると「10」が「2」より前になります。数の大小で並べるときは先に整数へ変換します。", "Ruby の sort は新しい配列を返し、sort! は元の配列を変えます。C# の Array.Sort は配列自体を並べ替えます。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, k = data[0, 2]
a = data[2, n]
a.sort!
puts a[k - 1]`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        int k = int.Parse(t[1]);
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = long.Parse(t[i + 2]);
        Array.Sort(a);
        Console.WriteLine(a[k - 1]);
    }
}`,
    input: "5 3\n8 3 5 1 9\n", output: "5\n", quiz: {question: "[4, 1, 4, 2] の小さい方から3番目の値は？", options: ["4", "2", "1"], correct: 0, explanation: "並べると [1, 2, 4, 4]。重複も数えるので3番目は4です。"}
  },
  {
    id: "hash", title: "ハッシュで数える", subtitle: "「これまで何回？」をすぐ取り出す。", category: "アルゴリズム", level: "初級", minutes: 14, complexity: "平均 O(N)",
    intro: "ハッシュ表は、キーに対応する値を保存する仕組みです。Ruby の Hash、C# の Dictionary を使うと、出現回数を管理できます。この例では、値が等しい位置の組 i < j の数を求めます。",
    when: "値の範囲が広く配列で数えにくいとき。重複、頻度、過去に見た値の有無を調べる問題に向いています。",
    steps: ["左から順に値 x を読みます。辞書 count[x] には「今の位置より前に x が出た回数」を入れておきます。", "新しい x は、過去の x それぞれと1組を作れます。だから答えに count[x] を足します。", "組を数えた後で count[x] を1増やします。この順序なら、自分自身を組に含めません。", "[3, 1, 3, 2, 1, 3] では3同士が3組、1同士が1組で合計4組です。辞書の参照・更新を平均 O(1) とすると全体は平均 O(N) です。"],
    pitfalls: ["出現回数を増やしてから答えに足すと、自分自身との組まで数えます。", "辞書のキーがまだない場合を扱います。Ruby は Hash.new(0)、C# は TryGetValue が便利です。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]
count = Hash.new(0)
answer = 0
n.times do |i|
  x = data[i + 1]
  answer += count[x]
  count[x] += 1
end
puts answer`,
    csharp: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        var count = new Dictionary<long, long>();
        long answer = 0;
        for (int i = 0; i < n; i++)
        {
            long x = long.Parse(t[i + 1]);
            long seen;
            count.TryGetValue(x, out seen);
            answer += seen;
            count[x] = seen + 1;
        }
        Console.WriteLine(answer);
    }
}`,
    input: "6\n3 1 3 2 1 3\n", output: "4\n", quiz: {question: "同じ値が4回登場したとき、その値だけで作れる i < j の組は？", options: ["4組", "6組", "16組"], correct: 1, explanation: "後ろから追加される組は0、1、2、3組。合計6組で、4×3÷2 と同じです。"}
  },
  {
    id: "prefix", title: "累積和", subtitle: "たくさんの区間の合計を、一瞬で。", category: "アルゴリズム", level: "初級", minutes: 15, complexity: "前処理 O(N)・1問 O(1)",
    intro: "累積和は「先頭からここまでの合計」を先に計算する方法です。区間の合計は、大きい合計から不要な部分を引けば求められます。配列が変わらず、合計を何度も聞かれる問題で活躍します。",
    when: "同じ配列について、L 番目から R 番目までの合計を繰り返し求めるとき。要素の更新がある場合は別のデータ構造も検討します。",
    steps: ["S[0] = 0 とします。S[i] は「先頭 i 個の合計」です。元の配列より1つ長い N+1 要素を用意します。", "0始まりの配列 A に対して S[i+1] = S[i] + A[i] と計算します。[2,4,1,3,5] なら S は [0,2,6,7,10,15] です。", "入力の L と R が1始まり・両端を含むなら、答えは S[R] − S[L−1]。2番目から4番目は 10 − 2 = 8 です。", "前処理 O(N) の後は1問あたり O(1)。Q 個の質問を処理する合計時間は O(N+Q) です。負の値が含まれていても使えます。"],
    pitfalls: ["S[R] − S[L] にすると L 番目の値まで引いてしまいます。S[i] の定義を言葉で確認しましょう。", "各要素が int に収まっても合計は超えることがあります。C# の累積和には long を使います。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, q = data[0, 2]
a = data[2, n]
s = Array.new(n + 1, 0)
n.times { |i| s[i + 1] = s[i] + a[i] }
pos = n + 2
q.times do
  l, r = data[pos, 2]
  pos += 2
  puts s[r] - s[l - 1]
end`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int p = 0;
        int n = int.Parse(t[p++]);
        int q = int.Parse(t[p++]);
        long[] s = new long[n + 1];
        for (int i = 0; i < n; i++) s[i + 1] = s[i] + long.Parse(t[p++]);
        for (int i = 0; i < q; i++)
        {
            int l = int.Parse(t[p++]);
            int r = int.Parse(t[p++]);
            Console.WriteLine(s[r] - s[l - 1]);
        }
    }
}`,
    input: "5 3\n2 4 1 3 5\n2 4\n1 5\n3 3\n", output: "8\n15\n1\n", quiz: {question: "S[i] が先頭 i 個の合計。1始まりで3番目〜5番目の合計は？", options: ["S[5] − S[3]", "S[4] − S[2]", "S[5] − S[2]"], correct: 2, explanation: "先頭5個から先頭2個を引くと、3・4・5番目が残ります。"}
  },
  {
    id: "binary", title: "二分探索", subtitle: "候補を半分ずつ、しぼり込む。", category: "探索", level: "中級", minutes: 18, complexity: "探索 O(log N)",
    intro: "二分探索は、条件が「満たさない → 満たす」と一方向に変わる境界を探す方法です。この例では昇順に並んだ配列から、X 以上となる最初の位置を探します。これを lower_bound と呼びます。",
    when: "ソート済み配列の境界を探すとき。「この値なら可能」と判定でき、答えの大小に対して判定が単調に変わる問題にも応用できます。",
    steps: ["left = 0、right = N で開始します。left より左は X 未満、right 以降は X 以上、という状態を保ちます。N は配列の末尾の1つ先です。", "mid = left + (right−left)/2 を調べます。A[mid] < X なら mid までを除外して left = mid+1 にします。", "A[mid] ≥ X なら、もっと左に答えがあるかもしれません。mid 自体を候補として残すため right = mid にします。", "left == right でその位置が答えです。出力は0始まりの添字。X 以上が1つもなければ N を返します。重複があっても最初の位置になります。"],
    pitfalls: ["このコードには昇順という前提があります。未ソートの配列に使ってはいけません。ソートが必要なら、その計算量 O(N log N) も加わります。", "答えが N の場合に A[N] を読まないこと。N は「該当なし」を表す位置で、要素は存在しません。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, x = data[0, 2]
a = data[2, n]
left = 0
right = n
while left < right
  mid = left + (right - left) / 2
  if a[mid] < x
    left = mid + 1
  else
    right = mid
  end
end
puts left`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long x = long.Parse(t[1]);
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = long.Parse(t[i + 2]);
        int left = 0, right = n;
        while (left < right)
        {
            int mid = left + (right - left) / 2;
            if (a[mid] < x) left = mid + 1;
            else right = mid;
        }
        Console.WriteLine(left);
    }
}`,
    input: "6 7\n1 3 5 7 7 10\n", output: "3\n", quiz: {question: "[1, 3, 5] で X = 8 の lower_bound の結果は？（0始まり）", options: ["3", "2", "0"], correct: 0, explanation: "8以上の要素がないため、配列の長さ N = 3 を返します。A[3] は読めません。"}
  },
  {
    id: "twopointer", title: "しゃくとり法", subtitle: "左右の端を動かして、区間を育てる。", category: "アルゴリズム", level: "中級", minutes: 18, complexity: "O(N)",
    intro: "しゃくとり法は、区間の左右の端を前に進めながら条件を満たす区間を調べる方法です。この例では、非負整数の配列から「合計が K 以下」の連続区間の最大長を求めます。K は0以上とします。",
    when: "区間を伸ばすと条件が一方向に変化するとき。この例では、要素が非負なので右に伸ばすと合計は減りません。",
    steps: ["left = 0、sum = 0 で始め、right を左から右へ動かします。新しい A[right] を sum に加えます。", "sum > K の間は、A[left] を引いて left を1つ右へ進めます。合計が条件を満たすまで左端を縮めます。", "調整後の区間 [left, right] の長さ right−left+1 を答えの候補にします。要素1つでも K を超えるなら区間が空になり、長さは0になります。", "right は N 回、left も全体で最大 N 回しか進みません。while が入れ子でも計算量は O(N) です。"],
    pitfalls: ["負の数があると、区間を伸ばして合計が減ることがあります。この方法をそのまま使う前提が崩れます。", "連続区間の問題です。好きな位置の要素を飛び飛びに選ぶ部分列とは違います。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, k = data[0, 2]
a = data[2, n]
left = 0
sum = 0
answer = 0
n.times do |right|
  sum += a[right]
  while sum > k
    sum -= a[left]
    left += 1
  end
  answer = [answer, right - left + 1].max
end
puts answer`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long k = long.Parse(t[1]);
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = long.Parse(t[i + 2]);
        int left = 0, answer = 0;
        long sum = 0;
        for (int right = 0; right < n; right++)
        {
            sum += a[right];
            while (sum > k) sum -= a[left++];
            answer = Math.Max(answer, right - left + 1);
        }
        Console.WriteLine(answer);
    }
}`,
    input: "5 7\n2 1 3 2 4\n", output: "3\n", quiz: {question: "このしゃくとり法で、配列の値が非負であることが必要な理由は？", options: ["ソート済みにするため", "区間を伸ばしたとき合計が減らないため", "添字が負になるのを防ぐため"], correct: 1, explanation: "右端を伸ばせば合計は増えるか同じ、左端を縮めれば減るか同じ。この単調性で候補を捨てられます。"}
  },
  {
    id: "greedy", title: "貪欲法", subtitle: "今の選択が、未来を邪魔しないか。", category: "アルゴリズム", level: "中級", minutes: 18, complexity: "O(N log N)",
    intro: "貪欲法は、その場で最もよさそうな選択を繰り返す方法です。ただし「よさそう」だけでは正しさは保証されません。この例では、時間が重ならない予定を最大個数選ぶ区間スケジューリングを考えます。",
    when: "局所的な選択で最適解を失わないと説明できる問題。今回は各予定の価値が同じで、選ぶ個数を最大にします。",
    steps: ["予定を [開始, 終了) と考えます。ある予定が終了する時刻に次の予定を開始できます。各予定は開始 < 終了とします。", "終了時刻が早い順にソートします。現在選べる予定の中で最も早く終わるものを選ぶと、その後の空き時間を広く残せます。", "直前に選んだ予定の終了時刻 last を記録します。開始 ≥ last の予定を選び、last をその終了時刻に更新します。", "最適解の最初の予定を、最も早く終わる予定に置き換えても、その後の予定は邪魔しません。この交換を繰り返せることが正しさの理由です。"],
    pitfalls: ["開始が早い順や長さが短い順で選んでも、常に最適にはなりません。選択基準の証明が必要です。", "予定ごとに報酬が違い、報酬の合計を最大にしたい場合、この方法では解けないことがあります。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]
jobs = Array.new(n) { |i| data[1 + 2 * i, 2] }
jobs.sort_by! { |job| job[1] }
last = nil
answer = 0
jobs.each do |start_time, end_time|
  if last.nil? || start_time >= last
    answer += 1
    last = end_time
  end
end
puts answer`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long[][] jobs = new long[n][];
        for (int i = 0; i < n; i++)
            jobs[i] = new long[] { long.Parse(t[1 + i * 2]), long.Parse(t[2 + i * 2]) };
        Array.Sort(jobs, (a, b) => a[1].CompareTo(b[1]));
        long last = long.MinValue;
        int answer = 0;
        foreach (long[] job in jobs)
        {
            if (job[0] < last) continue;
            answer++;
            last = job[1];
        }
        Console.WriteLine(answer);
    }
}`,
    input: "5\n1 3\n2 5\n3 4\n4 7\n6 8\n", output: "3\n", quiz: {question: "予定を最大個数選ぶこの問題で、優先するのは？", options: ["開始時刻が最も早い予定", "長さが最も短い予定", "選べる中で終了時刻が最も早い予定"], correct: 2, explanation: "早く終わる予定なら後に残る空き時間が狭くなりません。最適解の先頭を置き換えても個数を減らさずに済みます。"}
  },
  {
    id: "bfs", title: "幅優先探索 / BFS", subtitle: "近い場所から、波のように広がる。", category: "探索", level: "中級", minutes: 20, complexity: "O(N + M)",
    intro: "BFS は、始点から近い頂点を順番に訪れる探索です。すべての辺の移動コストが同じなら、最短距離を求められます。この例は無向グラフで、始点 S から各頂点までに通る辺の最小本数を出します。",
    when: "重みのないグラフや、1歩のコストが同じ迷路の最短経路。辺ごとにコストが違う場合は別の最短経路法を検討します。",
    steps: ["入力は N M S の後に M 本の辺です。頂点番号は1始まりなので、コード内では1を引きます。無向辺は両方向を隣接リストに追加します。", "距離 dist を −1 で初期化します。−1 は未訪問。始点だけ距離0にし、キューの末尾に入れます。", "キューの先頭から頂点 v を取り出し、未訪問の隣接頂点 u に dist[v]+1 を入れてキューへ追加します。訪問済みの印は追加する時点で付けます。", "先に入れた頂点から取り出すので、距離0、1、2…の順で広がります。到達できない頂点は −1 のままです。各頂点・辺を定数回ずつ処理し O(N+M) です。"],
    pitfalls: ["キューに入れる時点で訪問済みにしないと、同じ頂点を何度も追加してしまうことがあります。", "この BFS の距離は辺の本数です。辺の重みが違う問題で、そのまま最小コストになるとは限りません。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, m, start = data[0, 3]
start -= 1
graph = Array.new(n) { [] }
m.times do |i|
  a = data[3 + 2 * i] - 1
  b = data[4 + 2 * i] - 1
  graph[a] << b
  graph[b] << a
end
dist = Array.new(n, -1)
dist[start] = 0
queue = [start]
head = 0
while head < queue.length
  v = queue[head]
  head += 1
  graph[v].each do |u|
    next if dist[u] != -1
    dist[u] = dist[v] + 1
    queue << u
  end
end
puts dist.join(' ')`,
    csharp: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int p = 0;
        int n = int.Parse(t[p++]), m = int.Parse(t[p++]);
        int start = int.Parse(t[p++]) - 1;
        var graph = new List<int>[n];
        for (int i = 0; i < n; i++) graph[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int a = int.Parse(t[p++]) - 1, b = int.Parse(t[p++]) - 1;
            graph[a].Add(b);
            graph[b].Add(a);
        }
        int[] dist = new int[n];
        for (int i = 0; i < n; i++) dist[i] = -1;
        var queue = new Queue<int>();
        dist[start] = 0;
        queue.Enqueue(start);
        while (queue.Count > 0)
        {
            int v = queue.Dequeue();
            foreach (int u in graph[v])
            {
                if (dist[u] != -1) continue;
                dist[u] = dist[v] + 1;
                queue.Enqueue(u);
            }
        }
        Console.WriteLine(string.Join(" ", dist));
    }
}`,
    input: "6 5 1\n1 2\n1 3\n2 4\n3 4\n4 5\n", output: "0 1 1 2 3 -1\n", quiz: {question: "すべての辺のコストが1のとき、BFS で最短距離が求まる理由は？", options: ["距離が小さい頂点から順に処理するため", "必ず頂点番号順に訪問するため", "すべての経路を列挙するため"], correct: 0, explanation: "キューを使うと距離0、1、2…の順に訪れます。初めて見つかった距離より短い経路が後から現れません。"}
  },
  {
    id: "dfs", title: "深さ優先探索 / DFS", subtitle: "つながりを、奥までたどる。", category: "探索", level: "中級", minutes: 18, complexity: "O(N + M)",
    intro: "DFS は、進める場所を深くたどっていく探索です。この例では、無向グラフが何個の「つながったグループ」に分かれているかを数えます。これを連結成分数と呼びます。辺のない頂点も1つのグループです。",
    when: "到達可能性、連結成分、木の探索など。再帰でも書けますが、ここでは深いグラフでも呼び出しスタックを使い切らないよう明示的なスタックを使います。",
    steps: ["すべての頂点を未訪問にします。頂点を順番に見て、まだ訪れていなければ新しいグループの出発点です。答えを1増やします。", "出発点を訪問済みにしてスタックへ入れます。スタックは、最後に入れた頂点を最初に取り出す仕組みです。", "取り出した頂点から未訪問の隣接頂点へ進みます。隣接頂点を追加するときに訪問済みにし、重複して積まないようにします。", "スタックが空になると、その出発点とつながる頂点はすべて訪問済みです。残った未訪問頂点から同じ処理を始めれば、全グループを数えられます。"],
    pitfalls: ["始点を1つ選んだ探索だけでは、つながっていないグループを見落とします。外側の頂点ループが必要です。", "普通の DFS の訪問順で最短距離が決まるわけではありません。重みなし最短経路には BFS を使います。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n, m = data[0, 2]
graph = Array.new(n) { [] }
m.times do |i|
  a = data[2 + 2 * i] - 1
  b = data[3 + 2 * i] - 1
  graph[a] << b
  graph[b] << a
end
seen = Array.new(n, false)
answer = 0
n.times do |start|
  next if seen[start]
  answer += 1
  seen[start] = true
  stack = [start]
  until stack.empty?
    v = stack.pop
    graph[v].each do |u|
      next if seen[u]
      seen[u] = true
      stack << u
    end
  end
end
puts answer`,
    csharp: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int p = 0;
        int n = int.Parse(t[p++]), m = int.Parse(t[p++]);
        var graph = new List<int>[n];
        for (int i = 0; i < n; i++) graph[i] = new List<int>();
        for (int i = 0; i < m; i++)
        {
            int a = int.Parse(t[p++]) - 1, b = int.Parse(t[p++]) - 1;
            graph[a].Add(b);
            graph[b].Add(a);
        }
        bool[] seen = new bool[n];
        int answer = 0;
        for (int start = 0; start < n; start++)
        {
            if (seen[start]) continue;
            answer++;
            seen[start] = true;
            var stack = new Stack<int>();
            stack.Push(start);
            while (stack.Count > 0)
            {
                int v = stack.Pop();
                foreach (int u in graph[v])
                {
                    if (seen[u]) continue;
                    seen[u] = true;
                    stack.Push(u);
                }
            }
        }
        Console.WriteLine(answer);
    }
}`,
    input: "6 4\n1 2\n2 3\n4 5\n5 6\n", output: "2\n", quiz: {question: "頂点が5個、辺が0本の無向グラフの連結成分数は？", options: ["0", "1", "5"], correct: 2, explanation: "辺がなくても各頂点は1つの連結成分です。5個の独立したグループがあります。"}
  },
  {
    id: "dp", title: "動的計画法 / DP", subtitle: "小さい答えを、次の答えにつなげる。", category: "動的計画法", level: "中級", minutes: 25, complexity: "O(N)",
    intro: "DP は、小さい部分問題の答えを保存し、大きい問題の答えに使う方法です。この例では、カエルが並んだ足場を1つ先か2つ先へ跳びます。移動コストは足場の高さの差の絶対値。最後の足場までの最小コストを求めます。",
    when: "同じ部分問題が繰り返し現れ、状態を決めれば残りの判断に必要な情報が足りるとき。まず「何を dp に保存するか」を1文で定義します。",
    steps: ["dp[i] を「足場0から足場iに到達する最小コスト」と定義します。最初の足場には移動なしで立てるので dp[0] = 0。N は1以上とします。", "足場 i への最後のジャンプは i−1 か i−2 からです。1つ前からなら dp[i−1] + |h[i]−h[i−1]| になります。", "i ≥ 2 なら、2つ前からの dp[i−2] + |h[i]−h[i−2]| も候補にします。2つの候補の小さい方を dp[i] に保存します。", "小さい添字から計算すれば、必要な値はすでに確定しています。全ての最後のジャンプを比べているので取りこぼしがありません。答えは dp[N−1] です。"],
    pitfalls: ["「今いちばん安いジャンプ」を選ぶだけでは、最後までの最小コストになるとは限りません。到着先ごとの最小値を保存します。", "N = 1 では答えは0です。i = 1 の計算で i−2 を読まないよう、条件分岐を入れます。"],
    ruby: `data = STDIN.read.split.map(&:to_i)
n = data[0]
h = data[1, n]
dp = Array.new(n, 0)
(1...n).each do |i|
  dp[i] = dp[i - 1] + (h[i] - h[i - 1]).abs
  if i >= 2
    via_two = dp[i - 2] + (h[i] - h[i - 2]).abs
    dp[i] = [dp[i], via_two].min
  end
end
puts dp[n - 1]`,
    csharp: `using System;
class Program
{
    static void Main()
    {
        string[] t = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
        int n = int.Parse(t[0]);
        long[] h = new long[n];
        for (int i = 0; i < n; i++) h[i] = long.Parse(t[i + 1]);
        long[] dp = new long[n];
        for (int i = 1; i < n; i++)
        {
            dp[i] = dp[i - 1] + Math.Abs(h[i] - h[i - 1]);
            if (i >= 2)
                dp[i] = Math.Min(dp[i], dp[i - 2] + Math.Abs(h[i] - h[i - 2]));
        }
        Console.WriteLine(dp[n - 1]);
    }
}`,
    input: "4\n10 30 40 20\n", output: "30\n", quiz: {question: "この問題で dp[0] = 0 にする理由は？", options: ["足場0の高さが必ず0だから", "最初の足場にいるだけなら移動コストがかからないから", "配列は必ず0で初期化するから"], correct: 1, explanation: "dp は高さではなく到達コストです。出発点には最初からいるため、コストは0になります。"}
  }
];
