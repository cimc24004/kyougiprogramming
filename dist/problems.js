window.PROBLEMS = [
  {
    id: 'p01', lesson: 'io', title: '今日のスコア', level: '入門', time: 10,
    statement: 'N 回ゲームをして、各回で A₁, A₂, …, Aₙ 点を獲得しました。点数には負の値もあります。すべての回の合計点を出力してください。',
    constraints: ['1 ≤ N ≤ 200,000', '−1,000,000,000 ≤ Aᵢ ≤ 1,000,000,000', '入力はすべて整数'],
    format: '入力：1 行目に N、2 行目に N 個の整数 A₁ … Aₙ。出力：合計点を 1 行に出力する。',
    hints: ['まず N を読み、続く N 個の値を配列として読みましょう。', '合計を 0 で初期化し、各値を 1 回ずつ足します。', '合計は 32 ビット整数の範囲を超えます。C# では long を使いましょう。'],
    explanation: '合計を 0 から始め、N 個の値を順番に足します。各要素を 1 回見るので時間計算量は O(N) です。C# の int の上限は約 21 億ですが、答えの絶対値は最大 200,000 × 1,000,000,000 なので long が必要です。Ruby の Integer は大きな整数も扱えます。',
    tests: [
      { input: '5\n3 -2 7 0 4\n', output: '12\n' },
      { input: '1\n-1000000000\n', output: '-1000000000\n' },
      { input: '3\n1000000000 1000000000 1000000000\n', output: '3000000000\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\na = data[1, n]\n\n# 合計を求めて出力しよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        // long 型で合計を求めて出力しよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\nsum = 0\nn.times { |i| sum += data[i + 1] }\nputs sum\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long sum = 0;\n        for (int i = 0; i < n; i++) sum += long.Parse(s[i + 1]);\n        Console.WriteLine(sum);\n    }\n}\n'
    }
  },
  {
    id: 'p02', lesson: 'complexity', title: '10 億回の足し算？', level: '入門', time: 10,
    statement: '整数 N が与えられます。1 + 2 + … + N を求めてください。N は最大 10 億です。1 から N まで繰り返す方法より、少ない回数の計算で求める方法を考えましょう。',
    constraints: ['1 ≤ N ≤ 1,000,000,000', 'N は整数'],
    format: '入力：整数 N。出力：1 から N までの整数の和。',
    hints: ['最初と最後の数を組にすると、1 + N です。次の組 2 + (N − 1) は？', '和を逆順にしたものと足すと、どの位置でも N + 1 になります。', '答えは N × (N + 1) / 2。C# では掛け算をする前から long を使いましょう。'],
    explanation: 'S = 1 + 2 + … + N と逆順の S を足すと、2S = N(N + 1) です。したがって S = N(N + 1)/2。繰り返しがなく時間計算量は O(1) です。C# では N を long で読み、途中の積も long で計算します。小さいテストで正解しても、遅い O(N) の実装では最大入力に対応できない点に注意しましょう。',
    tests: [
      { input: '5\n', output: '15\n' },
      { input: '1\n', output: '1\n' },
      { input: '1000000000\n', output: '500000000500000000\n' }
    ],
    starter: {
      ruby: 'n = STDIN.read.to_i\n# 繰り返さずに和を求めよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        long n = long.Parse(Console.In.ReadToEnd().Trim());\n        // 繰り返さずに和を求めよう\n    }\n}\n'
    },
    solution: {
      ruby: 'n = STDIN.read.to_i\nputs n * (n + 1) / 2\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        long n = long.Parse(Console.In.ReadToEnd().Trim());\n        Console.WriteLine(n * (n + 1) / 2);\n    }\n}\n'
    }
  },
  {
    id: 'p03', lesson: 'brute', title: 'ふたりでぴったり', level: '初級', time: 15,
    statement: 'N 枚のカードに整数 A₁, A₂, …, Aₙ が書かれています。異なる 2 枚を選び、その和を K にしたいです。選び方は何通りありますか。同じ値でもカードの位置が違えば別のカードです。順序だけが違う選び方は同じとみなします。',
    constraints: ['1 ≤ N ≤ 2,000', '−1,000,000,000 ≤ Aᵢ ≤ 1,000,000,000', '−2,000,000,000 ≤ K ≤ 2,000,000,000'],
    format: '入力：1 行目に N K、2 行目に A₁ … Aₙ。出力：和が K になる組の数。',
    hints: ['N ≤ 2,000 なら、すべての 2 枚の組を調べる方法を考えられます。', '添字 i と j について i < j だけを調べると、同じ組を 2 回数えません。', '外側で i、内側で j = i + 1 から N − 1 までを動かし、A[i] + A[j] == K なら答えを 1 増やします。'],
    explanation: 'i < j を満たす組だけを二重ループで調べます。これで自分自身を選ばず、順序を入れ替えた重複も防げます。調べる組数は N(N − 1)/2 なので O(N²)。この制約なら約 200 万組です。値が同じカードも位置ごとに数えるので、先に重複を取り除いてはいけません。',
    tests: [
      { input: '4 7\n1 3 4 6\n', output: '2\n' },
      { input: '1 4\n2\n', output: '0\n' },
      { input: '5 4\n2 2 2 2 2\n', output: '10\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n]\n# i < j の組をすべて調べよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long k = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        // i < j の組をすべて調べよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n]\nanswer = 0\nn.times do |i|\n  (i + 1...n).each do |j|\n    answer += 1 if a[i] + a[j] == k\n  end\nend\nputs answer\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long k = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        long answer = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i + 1; j < n; j++)\n                if (a[i] + a[j] == k) answer++;\n        Console.WriteLine(answer);\n    }\n}\n'
    }
  },
  {
    id: 'p04', lesson: 'sort', title: '小さい順に K 番目', level: '初級', time: 12,
    statement: 'N 個の整数を小さい順に並べたとき、K 番目にある値を求めてください。同じ値が複数ある場合も、それぞれを 1 個として数えます。',
    constraints: ['1 ≤ K ≤ N ≤ 200,000', '−1,000,000,000 ≤ Aᵢ ≤ 1,000,000,000'],
    format: '入力：1 行目に N K、2 行目に A₁ … Aₙ。出力：小さい順で K 番目の値。K は 1 始まり。',
    hints: ['まず配列を昇順にソートしましょう。', '重複する値も残します。ユニークな値の K 番目ではありません。', '配列の添字は 0 始まりなので、K 番目は a[K − 1] です。'],
    explanation: '昇順ソート後の配列 a[K − 1] が答えです。並べ替えに O(N log N)、値の取得に O(1) かかります。問題文の「K 番目」は 1 始まり、配列は 0 始まりなので、1 のずれに注意しましょう。',
    tests: [
      { input: '6 3\n8 3 3 10 1 5\n', output: '3\n' },
      { input: '1 1\n-7\n', output: '-7\n' },
      { input: '4 4\n9 -2 5 1\n', output: '9\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n]\n# 並べ替えて K 番目を出力しよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), k = int.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        // 並べ替えて K 番目を出力しよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n].sort\nputs a[k - 1]\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), k = int.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        Array.Sort(a);\n        Console.WriteLine(a[k - 1]);\n    }\n}\n'
    }
  },
  {
    id: 'p05', lesson: 'hash', title: 'いちばん多い数字', level: '初級', time: 18,
    statement: 'N 個の整数の中で、出現回数が最も多い値と、その出現回数を求めてください。最も多い値が複数ある場合は、その中で最も小さい値を選びます。',
    constraints: ['1 ≤ N ≤ 200,000', '−1,000,000,000 ≤ Aᵢ ≤ 1,000,000,000'],
    format: '入力：1 行目に N、2 行目に A₁ … Aₙ。出力：選んだ値とその出現回数を空白区切りで出力する。',
    hints: ['値をキー、出現回数を値とする辞書を用意しましょう。', 'Ruby は Hash.new(0)、C# は Dictionary<long, int> を使えます。', '辞書を走査し、回数が大きい場合、または同じ回数で値が小さい場合に答えを更新します。'],
    explanation: '辞書で各整数の出現回数を数えます。次に各キーを調べ、回数が最大になるものを選びます。同率のときに小さい値を選ぶ条件も明示します。辞書の列挙順には頼りません。ハッシュ表の操作を平均 O(1) とすると、全体は平均 O(N) です。',
    tests: [
      { input: '7\n4 2 4 3 2 4 2\n', output: '2 3\n' },
      { input: '1\n-5\n', output: '-5 1\n' },
      { input: '5\n9 9 9 9 9\n', output: '9 5\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\na = data[1, n]\n# 辞書で出現回数を数えよう\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        // Dictionary<long, int> で出現回数を数えよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\ncounts = Hash.new(0)\ndata[1, n].each { |x| counts[x] += 1 }\nbest_value = 0\nbest_count = 0\ncounts.each do |value, count|\n  if count > best_count || (count == best_count && value < best_value)\n    best_value = value\n    best_count = count\n  end\nend\nputs "#{best_value} #{best_count}"\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        var counts = new Dictionary<long, int>();\n        for (int i = 0; i < n; i++) {\n            long value = long.Parse(s[i + 1]);\n            int count;\n            counts.TryGetValue(value, out count);\n            counts[value] = count + 1;\n        }\n        long bestValue = 0;\n        int bestCount = 0;\n        foreach (var pair in counts) {\n            if (pair.Value > bestCount || (pair.Value == bestCount && pair.Key < bestValue)) {\n                bestValue = pair.Key;\n                bestCount = pair.Value;\n            }\n        }\n        Console.WriteLine(bestValue + " " + bestCount);\n    }\n}\n'
    }
  },
  {
    id: 'p06', lesson: 'prefix', title: '区間の合計、何度でも', level: '初級', time: 20,
    statement: 'N 個の整数 A₁, A₂, …, Aₙ と Q 個の質問が与えられます。各質問には L と R があり、Aₗ + Aₗ₊₁ + … + Aᵣ を求めます。質問のたびに区間を最初から足し直さず、前処理を活用してください。',
    constraints: ['1 ≤ N, Q ≤ 200,000', '−1,000,000,000 ≤ Aᵢ ≤ 1,000,000,000', '1 ≤ L ≤ R ≤ N'],
    format: '入力：1 行目に N Q、2 行目に A₁ … Aₙ、続く Q 行に L R。出力：各質問の答えを入力順に 1 行ずつ出力する。区間の両端を含む。',
    hints: ['S[i] を「先頭 i 個の合計」とします。S[0] = 0 です。', '区間 L〜R の合計は、先頭 R 個の合計から先頭 L − 1 個の合計を引けば求まります。', '答えは S[R] − S[L − 1]。累積和を N + 1 要素の配列で作りましょう。'],
    explanation: 'S[0] = 0、S[i + 1] = S[i] + A[i] として累積和を作ります。1 始まりで両端を含む L〜R の合計は S[R] − S[L − 1] です。前処理 O(N)、各質問 O(1)、全体 O(N + Q)。負の値があっても差の式は成立します。C# の累積和は long にします。',
    tests: [
      { input: '5 3\n2 -1 4 0 3\n1 3\n2 5\n4 4\n', output: '5\n6\n0\n' },
      { input: '1 2\n-1000000000\n1 1\n1 1\n', output: '-1000000000\n-1000000000\n' },
      { input: '3 1\n1000000000 1000000000 1000000000\n1 3\n', output: '3000000000\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, q = data[0, 2]\na = data[2, n]\n# 累積和を作り、その後 Q 個の質問に答えよう\n',
      csharp: 'using System;\nusing System.Text;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), q = int.Parse(s[1]);\n        // long[] の累積和を作り、質問に答えよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, q = data[0, 2]\nprefix = Array.new(n + 1, 0)\nn.times { |i| prefix[i + 1] = prefix[i] + data[i + 2] }\npos = n + 2\nanswers = []\nq.times do\n  left, right = data[pos, 2]\n  pos += 2\n  answers << prefix[right] - prefix[left - 1]\nend\nputs answers\n',
      csharp: 'using System;\nusing System.Text;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), q = int.Parse(s[1]);\n        long[] prefix = new long[n + 1];\n        for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + long.Parse(s[i + 2]);\n        int pos = n + 2;\n        var answer = new StringBuilder();\n        for (int i = 0; i < q; i++) {\n            int left = int.Parse(s[pos++]), right = int.Parse(s[pos++]);\n            answer.AppendLine((prefix[right] - prefix[left - 1]).ToString());\n        }\n        Console.Write(answer.ToString());\n    }\n}\n'
    }
  },
  {
    id: 'p07', lesson: 'binary', title: '条件を満たす最初の場所', level: '初級', time: 20,
    statement: '昇順（同じ値があってもよい）に並んだ N 個の整数 A と整数 X が与えられます。A[i] ≥ X を満たす最初の添字 i を、0 始まりで求めてください。該当する要素がない場合は N を出力します。二分探索で解いてみましょう。',
    constraints: ['1 ≤ N ≤ 200,000', '−1,000,000,000 ≤ Aᵢ, X ≤ 1,000,000,000', 'A は昇順にソート済み'],
    format: '入力：1 行目に N X、2 行目に A の N 要素。出力：X 以上の値が初めて現れる 0 始まりの添字。ない場合は N。',
    hints: ['「A[i] ≥ X」という条件は、配列上で偽、偽、…、真、真の順に変わります。', '候補の範囲を半開区間 [left, right) で表し、最初は left = 0、right = N にします。', 'A[mid] < X なら left = mid + 1、それ以外なら right = mid。left == right になったら left が答えです。'],
    explanation: 'lower_bound は「X 以上になる最初の位置」を探します。left より前は X 未満、right 以降は X 以上という境界を保ち、中央を見て候補を半分にします。right = N は配列の外側の境界で、A[N] を読む必要はありません。探索部分は O(log N)。入力を読み込む全体の時間は O(N) です。',
    tests: [
      { input: '5 4\n1 3 4 4 9\n', output: '2\n' },
      { input: '3 10\n2 4 8\n', output: '3\n' },
      { input: '4 -2\n-2 -2 1 5\n', output: '0\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, x = data[0, 2]\na = data[2, n]\n# 二分探索で最初の位置を求めよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long x = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        // 二分探索で最初の位置を求めよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, x = data[0, 2]\na = data[2, n]\nleft = 0\nright = n\nwhile left < right\n  mid = (left + right) / 2\n  if a[mid] < x\n    left = mid + 1\n  else\n    right = mid\n  end\nend\nputs left\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long x = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        int left = 0, right = n;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (a[mid] < x) left = mid + 1;\n            else right = mid;\n        }\n        Console.WriteLine(left);\n    }\n}\n'
    }
  },
  {
    id: 'p08', lesson: 'twopointer', title: '予算内でいちばん長く', level: '中級', time: 25,
    statement: 'N 日間のイベントがあり、i 日目の参加費は Aᵢ 円です。連続する何日かを選び、合計参加費を K 円以下にしたいです。選べる日数の最大値を求めてください。1 日も選べない場合は 0 を出力します。参加費が 0 円の日もあります。',
    constraints: ['1 ≤ N ≤ 200,000', '0 ≤ Aᵢ ≤ 1,000,000,000', '0 ≤ K ≤ 1,000,000,000,000,000,000'],
    format: '入力：1 行目に N K、2 行目に A₁ … Aₙ。出力：合計が K 以下になる連続区間の最大の長さ。',
    hints: ['区間の右端を 1 つずつ進め、区間内の合計を更新しましょう。', '合計が K を超えたら、K 以下に戻るまで左端を進めます。値がすべて非負だから、左端を進めても合計は増えません。', '各右端で条件を満たす区間の長さ right − left + 1 を調べます。左端と右端は、それぞれ全体で N 回しか進みません。'],
    explanation: '右端の値を合計に加え、合計が K を超える間だけ左端の値を引いて左端を進めます。条件を満たした区間長で答えを更新します。負の値がないため、一度捨てた左端を戻す必要がありません。左右の端が合計 O(N) 回動くので、二重ループでも O(N) です。0 円の日や空区間も自然に処理できます。',
    tests: [
      { input: '6 7\n2 1 4 3 1 2\n', output: '3\n' },
      { input: '4 0\n0 0 0 0\n', output: '4\n' },
      { input: '3 1\n2 3 4\n', output: '0\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n]\n# 左端・右端と区間の合計を管理しよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long k = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        // 左端・右端と区間の合計を管理しよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, k = data[0, 2]\na = data[2, n]\nleft = 0\nsum = 0\nanswer = 0\nn.times do |right|\n  sum += a[right]\n  while sum > k\n    sum -= a[left]\n    left += 1\n  end\n  answer = [answer, right - left + 1].max\nend\nputs answer\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long k = long.Parse(s[1]);\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = long.Parse(s[i + 2]);\n        int left = 0, answer = 0;\n        long sum = 0;\n        for (int right = 0; right < n; right++) {\n            sum += a[right];\n            while (sum > k) sum -= a[left++];\n            answer = Math.Max(answer, right - left + 1);\n        }\n        Console.WriteLine(answer);\n    }\n}\n'
    }
  },
  {
    id: 'p09', lesson: 'greedy', title: '重ならない予定', level: '中級', time: 25,
    statement: '参加したいイベントが N 個あります。イベント i は時刻 Sᵢ に始まり、時刻 Tᵢ に終わります。同時に 2 個には参加できません。最初から最後まで参加できるイベント数の最大値を求めてください。あるイベントの終了時刻と次の開始時刻が等しい場合は、両方に参加できます。移動時間はかかりません。',
    constraints: ['1 ≤ N ≤ 200,000', '0 ≤ Sᵢ < Tᵢ ≤ 1,000,000,000'],
    format: '入力：1 行目に N、続く N 行に Sᵢ Tᵢ。出力：重ならずに参加できるイベント数の最大値。',
    hints: ['開始時刻が早いイベントを選ぶと、非常に長い予定で後の選択肢を失うことがあります。', '終了時刻が最も早いイベントから考えると、残り時間を多く残せます。', '終了時刻の昇順にソートし、開始時刻が直前に選んだ終了時刻以上なら採用します。'],
    explanation: '終了時刻の早い順に並べ、参加できるものを順に選びます。最適解の最初のイベントを「最も早く終わるイベント」に交換しても、その後に選べる予定は減りません。同じ議論を残りにも繰り返せるので貪欲法が成立します。ソート O(N log N)、走査 O(N)。開始時刻と終了時刻が等しい接続は許可されるため、判定は start >= lastEnd です。',
    tests: [
      { input: '5\n1 3\n2 5\n3 4\n4 7\n6 8\n', output: '3\n' },
      { input: '1\n0 1\n', output: '1\n' },
      { input: '4\n0 10\n1 9\n2 8\n3 7\n', output: '1\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\nevents = data[1, 2 * n].each_slice(2).to_a\n# 終了時刻の順に考えてみよう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long[][] events = new long[n][];\n        for (int i = 0; i < n; i++)\n            events[i] = new long[] { long.Parse(s[1 + 2 * i]), long.Parse(s[2 + 2 * i]) };\n        // 終了時刻の順に考えてみよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\nevents = data[1, 2 * n].each_slice(2).to_a\nevents.sort_by! { |start, finish| finish }\nlast_end = 0\nanswer = 0\nevents.each do |start, finish|\n  if start >= last_end\n    answer += 1\n    last_end = finish\n  end\nend\nputs answer\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long[][] events = new long[n][];\n        for (int i = 0; i < n; i++)\n            events[i] = new long[] { long.Parse(s[1 + 2 * i]), long.Parse(s[2 + 2 * i]) };\n        Array.Sort(events, (a, b) => a[1].CompareTo(b[1]));\n        long lastEnd = 0;\n        int answer = 0;\n        foreach (long[] item in events) {\n            if (item[0] >= lastEnd) {\n                answer++;\n                lastEnd = item[1];\n            }\n        }\n        Console.WriteLine(answer);\n    }\n}\n'
    }
  },
  {
    id: 'p10', lesson: 'bfs', title: '目的地まで何本の道？', level: '中級', time: 30,
    statement: '1 から N までの番号がついた町があり、M 本の道で結ばれています。道はどちら向きにも通れます。町 1 から町 N まで移動するとき、通る道の本数の最小値を求めてください。たどり着けない場合は −1 を出力します。',
    constraints: ['1 ≤ N ≤ 200,000', '0 ≤ M ≤ 200,000', '1 ≤ Uᵢ, Vᵢ ≤ N、Uᵢ ≠ Vᵢ', '同じ 2 町を結ぶ道は重複しない'],
    format: '入力：1 行目に N M、続く M 行に道の両端 Uᵢ Vᵢ。出力：町 1 から町 N までの最小の道数。到達不能なら −1。',
    hints: ['すべての道のコストが 1 なので、幅優先探索（BFS）を使えます。', '未訪問の距離を −1 にし、町 1 の距離を 0 にしてキューに入れましょう。', 'キューの先頭から町を取り出し、未訪問の隣の町に「今の距離 + 1」を記録します。キューに入れた時点で訪問済みにします。'],
    explanation: 'BFS は始点から近い順に頂点を処理します。各辺のコストが同じなので、初めて発見した距離が最短距離です。無向グラフの道は両方向に登録します。Ruby ではキュー用配列と head 添字を使います。各頂点・各辺を定数回処理するため O(N + M)。N = 1 なら移動せず答えは 0 です。',
    tests: [
      { input: '6 6\n1 2\n1 3\n2 4\n3 4\n4 5\n5 6\n', output: '4\n' },
      { input: '1 0\n', output: '0\n' },
      { input: '4 2\n1 2\n3 4\n', output: '-1\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, m = data[0, 2]\ngraph = Array.new(n) { [] }\nm.times do |i|\n  u, v = data[2 + i * 2, 2].map { |x| x - 1 }\n  graph[u] << v\n  graph[v] << u\nend\n# BFS で最短距離を求めよう\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), m = int.Parse(s[1]);\n        var graph = new List<int>[n];\n        for (int i = 0; i < n; i++) graph[i] = new List<int>();\n        for (int i = 0; i < m; i++) {\n            int u = int.Parse(s[2 + 2 * i]) - 1, v = int.Parse(s[3 + 2 * i]) - 1;\n            graph[u].Add(v); graph[v].Add(u);\n        }\n        // BFS で最短距離を求めよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, m = data[0, 2]\ngraph = Array.new(n) { [] }\nm.times do |i|\n  u, v = data[2 + i * 2, 2].map { |x| x - 1 }\n  graph[u] << v\n  graph[v] << u\nend\ndist = Array.new(n, -1)\ndist[0] = 0\nqueue = [0]\nhead = 0\nwhile head < queue.length\n  u = queue[head]\n  head += 1\n  graph[u].each do |v|\n    next if dist[v] != -1\n    dist[v] = dist[u] + 1\n    queue << v\n  end\nend\nputs dist[n - 1]\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), m = int.Parse(s[1]);\n        var graph = new List<int>[n];\n        for (int i = 0; i < n; i++) graph[i] = new List<int>();\n        for (int i = 0; i < m; i++) {\n            int u = int.Parse(s[2 + 2 * i]) - 1, v = int.Parse(s[3 + 2 * i]) - 1;\n            graph[u].Add(v); graph[v].Add(u);\n        }\n        int[] dist = new int[n];\n        for (int i = 0; i < n; i++) dist[i] = -1;\n        var queue = new Queue<int>();\n        dist[0] = 0;\n        queue.Enqueue(0);\n        while (queue.Count > 0) {\n            int u = queue.Dequeue();\n            foreach (int v in graph[u]) {\n                if (dist[v] != -1) continue;\n                dist[v] = dist[u] + 1;\n                queue.Enqueue(v);\n            }\n        }\n        Console.WriteLine(dist[n - 1]);\n    }\n}\n'
    }
  },
  {
    id: 'p11', lesson: 'dfs', title: 'いくつのグループ？', level: '中級', time: 30,
    statement: 'N 人の間に M 組の知り合い関係があります。知り合いの知り合いもたどって到達できる人どうしを、同じグループとみなします。グループはいくつありますか。誰とも知り合いでない人も、1 人のグループとして数えます。関係は双方向です。',
    constraints: ['1 ≤ N ≤ 200,000', '0 ≤ M ≤ 200,000', '1 ≤ Uᵢ, Vᵢ ≤ N、Uᵢ ≠ Vᵢ', '同じ知り合い関係は重複しない'],
    format: '入力：1 行目に N M、続く M 行に知り合いどうしの番号 Uᵢ Vᵢ。出力：連結成分（グループ）の個数。',
    hints: ['まだ訪問していない人から探索を始めるたびに、新しいグループが 1 つ見つかります。', 'DFS でその人からたどれる人をすべて訪問済みにしましょう。探索が終わったら、次の未訪問の人を探します。', 'N が大きいので、深い再帰によるスタック不足を避けるために、明示的なスタックを使ってみましょう。'],
    explanation: '全頂点を順に調べ、未訪問なら答えを 1 増やし、その頂点から DFS を始めます。到達できる頂点をすべて訪問済みにするので、同じ連結成分を重複して数えません。再帰の代わりに配列・Stack を使い、追加時に訪問済みにします。孤立した頂点も 1 成分です。計算量は O(N + M)。',
    tests: [
      { input: '6 3\n1 2\n2 3\n4 5\n', output: '3\n' },
      { input: '1 0\n', output: '1\n' },
      { input: '4 4\n1 2\n2 3\n3 4\n4 1\n', output: '1\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, m = data[0, 2]\ngraph = Array.new(n) { [] }\nm.times do |i|\n  u, v = data[2 + i * 2, 2].map { |x| x - 1 }\n  graph[u] << v\n  graph[v] << u\nend\n# 未訪問の頂点から DFS を始めよう\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), m = int.Parse(s[1]);\n        var graph = new List<int>[n];\n        for (int i = 0; i < n; i++) graph[i] = new List<int>();\n        for (int i = 0; i < m; i++) {\n            int u = int.Parse(s[2 + 2 * i]) - 1, v = int.Parse(s[3 + 2 * i]) - 1;\n            graph[u].Add(v); graph[v].Add(u);\n        }\n        // 未訪問の頂点から DFS を始めよう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn, m = data[0, 2]\ngraph = Array.new(n) { [] }\nm.times do |i|\n  u, v = data[2 + i * 2, 2].map { |x| x - 1 }\n  graph[u] << v\n  graph[v] << u\nend\nseen = Array.new(n, false)\nanswer = 0\nn.times do |start|\n  next if seen[start]\n  answer += 1\n  seen[start] = true\n  stack = [start]\n  until stack.empty?\n    u = stack.pop\n    graph[u].each do |v|\n      next if seen[v]\n      seen[v] = true\n      stack << v\n    end\n  end\nend\nputs answer\n',
      csharp: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]), m = int.Parse(s[1]);\n        var graph = new List<int>[n];\n        for (int i = 0; i < n; i++) graph[i] = new List<int>();\n        for (int i = 0; i < m; i++) {\n            int u = int.Parse(s[2 + 2 * i]) - 1, v = int.Parse(s[3 + 2 * i]) - 1;\n            graph[u].Add(v); graph[v].Add(u);\n        }\n        bool[] seen = new bool[n];\n        int answer = 0;\n        var stack = new Stack<int>();\n        for (int start = 0; start < n; start++) {\n            if (seen[start]) continue;\n            answer++;\n            seen[start] = true;\n            stack.Push(start);\n            while (stack.Count > 0) {\n                int u = stack.Pop();\n                foreach (int v in graph[u]) {\n                    if (seen[v]) continue;\n                    seen[v] = true;\n                    stack.Push(v);\n                }\n            }\n        }\n        Console.WriteLine(answer);\n    }\n}\n'
    }
  },
  {
    id: 'p12', lesson: 'dp', title: 'カエルの最小ジャンプ費用', level: '中級', time: 30,
    statement: 'N 個の足場が左から順に並び、i 番目の高さは Hᵢ です。カエルは足場 1 から出発し、1 つ先か 2 つ先の足場へジャンプできます。高さ a から b へのジャンプ費用は |a − b| です。足場 N に着くまでの合計費用の最小値を求めてください。N = 1 なら費用は 0 です。',
    constraints: ['1 ≤ N ≤ 200,000', '1 ≤ Hᵢ ≤ 1,000,000,000'],
    format: '入力：1 行目に N、2 行目に H₁ … Hₙ。出力：最後の足場までの最小合計費用。',
    hints: ['dp[i] を「0 始まりで足場 i に着くまでの最小費用」と定義します。', '足場 i に来られるのは i − 1 または i − 2 からです。それぞれの最小費用に、今回のジャンプ費用を足します。', 'dp[0] = 0。まず i − 1 から来る値を入れ、i ≥ 2 なら i − 2 から来る値と比較して小さい方を採用します。'],
    explanation: 'dp[i] = min(dp[i − 1] + |H[i] − H[i − 1]|, dp[i − 2] + |H[i] − H[i − 2]|) とします。i = 1 では 1 つ前から来る場合だけを使います。過去の最小費用が確定した順に計算するので、経路をすべて列挙する必要はありません。時間 O(N)、DP 配列 O(N)。局所的に安いジャンプを選び続けるだけでは、最後までの最小費用は保証できません。',
    tests: [
      { input: '4\n10 30 40 20\n', output: '30\n' },
      { input: '1\n100\n', output: '0\n' },
      { input: '5\n7 7 7 7 7\n', output: '0\n' }
    ],
    starter: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\nh = data[1, n]\n# dp[i] の意味と初期値を決めてから書こう\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long[] h = new long[n];\n        for (int i = 0; i < n; i++) h[i] = long.Parse(s[i + 1]);\n        // dp[i] の意味と初期値を決めてから書こう\n    }\n}\n'
    },
    solution: {
      ruby: 'data = STDIN.read.split.map(&:to_i)\nn = data[0]\nh = data[1, n]\ndp = Array.new(n, 0)\n(1...n).each do |i|\n  dp[i] = dp[i - 1] + (h[i] - h[i - 1]).abs\n  if i >= 2\n    other = dp[i - 2] + (h[i] - h[i - 2]).abs\n    dp[i] = [dp[i], other].min\n  end\nend\nputs dp[n - 1]\n',
      csharp: 'using System;\nclass Program {\n    static void Main() {\n        string[] s = Console.In.ReadToEnd().Split((char[])null, StringSplitOptions.RemoveEmptyEntries);\n        int n = int.Parse(s[0]);\n        long[] h = new long[n];\n        for (int i = 0; i < n; i++) h[i] = long.Parse(s[i + 1]);\n        long[] dp = new long[n];\n        for (int i = 1; i < n; i++) {\n            dp[i] = dp[i - 1] + Math.Abs(h[i] - h[i - 1]);\n            if (i >= 2) dp[i] = Math.Min(dp[i], dp[i - 2] + Math.Abs(h[i] - h[i - 2]));\n        }\n        Console.WriteLine(dp[n - 1]);\n    }\n}\n'
    }
  }
];
