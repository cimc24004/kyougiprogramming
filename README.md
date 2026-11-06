# AlgoDojo+

Ruby と C# で「読んで、動かして、解く」競技プログラミング学習サイトです。

サイト: https://algodojo-plus.kuroonrails.chatgpt.site

## 内容

- 12 レッスン: 入出力・計算量・全探索・ソート・辞書・累積和・二分探索・尺取り法・貪欲法・BFS・DFS・動的計画法
- 5 種類の動く図解
- Ruby / C# のコード編集、標準入力、Wandbox による実行
- 12 問の練習問題、段階ヒント、解説、各 3 ケースの判定
- ブラウザ内へのコード・学習進捗の保存
- この PC の Codex CLI と接続する質問・解説機能

## ファイル

| 場所 | 内容 |
| --- | --- |
| `dist/` | ビルド不要のサイト本体 |
| `dist/downloads/AlgoDojo-Codex-Windows.zip` | Windows 用の接続プログラム |
| `local-codex/Start.cmd` | 接続プログラムの起動 |
| `local-codex/bridge.mjs` | ブラウザと Codex CLI の接続サーバー |
| `local-codex/Stop.ps1` | 接続プログラムの停止 |
| `local-codex/bridge.test.mjs` | 接続処理のテスト |
| `preview.mjs` | サイトのローカルプレビュー |
| `validate.cjs` | 教材データ、構文、参照ファイルの検証 |

## サイトのローカルプレビュー

Node.js を用意し、リポジトリのルートで実行します。

```sh
node preview.mjs
```

表示された `http://127.0.0.1:4173` をブラウザで開きます。通常のコード実行にはインターネット接続が必要です。コードと標準入力は Wandbox に送信されます。

## Windows から Codex に質問する

1. Node.js と Codex CLI をインストールし、Codex CLI にログインします。
2. `local-codex/Start.cmd` を開き、ウィンドウを開いたままにします。
3. 上記のサイトを開き、問題ページの「AI に解説・質問」を使います。
4. ブラウザにこの PC への接続確認が出た場合は、内容を確認して許可します。

接続サーバーは `127.0.0.1:49173` で待ち受けます。サイトから `POST /ask` で質問を受け取り、Codex CLI を実行します。サイトは `GET /jobs/{id}` で回答の完成を確認します。詳細は [`local-codex/README.txt`](local-codex/README.txt) を参照してください。

通常の起動では公開サイトのオリジンだけを許可します。ローカルプレビューで接続機能を開発・確認する場合は、`local-codex` 内で `node bridge.mjs --allow-preview` を使用します。

Codex のログイン情報、実行ログ、一時セッション、各ユーザーの学習記録は、このリポジトリに含めません。Codex の利用条件や上限は各アカウントに従います。

## 検証

```sh
node validate.cjs
node --test local-codex/bridge.test.mjs
```

接続処理のテストはローカル HTTP と模擬 Codex プロセスを使います。

`.openai/hosting.json` は既存の Sites プロジェクトの設定です。別の Sites プロジェクトに公開する場合は、自分のプロジェクト用の設定を使用してください。GitHub への push 自体はサイトの再公開を行いません。

構文表示に使用する Prism のライセンスは [`dist/vendor/LICENSE`](dist/vendor/LICENSE) にあります。
