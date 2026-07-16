# チョウノウ調律所 / Labo CHONO

ピアノ調律師・張能康博氏の公式サイト用プロジェクトです。  
[HP案 PDF（2026.6.18）](./チョウノウ調律所HP案'26.6.18.pdf) の構成をもとにしています。

## 技術構成

| 領域 | 技術 |
|------|------|
| サイト本体 | [Astro](https://astro.build/)（静的ビルド） |
| CMS | [microCMS](https://microcms.io/) |
| 問い合わせ | 静的 HTML + PHP（`mail()`） |

## ページ構成

| URL | 内容 |
|-----|------|
| `/` | トップ（お知らせ・紹介・料金・業務） |
| `/news/` | お知らせ一覧・詳細 |
| `/profile/` | 経歴・実績 |
| `/notes/` | 注釈・解説 |
| `/lab/` | Labo CHONO（調律研究所） |
| `/contact/` | 相談・連絡シート（Astro → 静的 HTML） |
| `/contact/thanks/` | 送信完了 |
| `/contact/error/` | 送信エラー |
| `/contact/send.php` など | PHP 送信・CSRF（`public/contact/`） |
| `/design/` | デザインシステム（ターゲット・コンセプト・配色・テキスト・コンポーネント／開発用・noindex） |

## セットアップ

### 1. Node.js

Node.js **22.12 以上**が必要です。

```bash
npm install
cp .env.example .env
```

`.env` に microCMS のサービスドメインと API キーを設定します。未設定でもフォールバック用のデモデータで表示・ビルドできます。

```bash
npm run dev
npm run build
```

ビルド成果物は `dist/` です。問い合わせ画面は Astro が HTML を生成し、`public/contact/` 配下の PHP も同じディレクトリへコピーされます。

### 2. microCMS API 設計（推奨）

サービス内に次の API を作成してください。

#### オブジェクト形式

**`site-settings`**

- `companyName` (テキスト)
- `labName` (テキスト)
- `catchphrase` (テキスト)
- `aboutText` (テキストエリア)
- `businessText` (テキストエリア)
- `feeGp` / `feeUp` (テキスト)
- `areaText` (テキストエリア)
- `address` / `phone` / `email` / `xUrl` (テキスト)
- `heroImage` (画像・任意)

**`profile`**

- `name` (テキスト)
- `birthText` (テキスト)
- `biography` (リッチエディタ推奨)
- `studios` / `liveHouses` / `discographyNote` (テキストエリア)

#### リスト形式

**`news`**

- `title` / `date` / `body` / `eyecatch`

**`lab-articles`**

- `title` / `category` / `series` / `excerpt` / `body`
- `audience`（`general` | `technician`）

**`works`**

- `title` / `artist` / `mediaType`（`lp` | `cd` | `other`） / `jacket` / `url` / `note`

**`glossary`**

- `term` / `reading` / `body`

記事本文（お知らせ・Labo CHONO・経歴）に `term` と一致する語句があると、ビルド時に注釈ページへのリンクが自動挿入されます。注釈ページには、その語が使われているページへの逆リンクも表示されます。

API エンドポイント名は `src/lib/microcms.ts` の定義と一致させてください。

### 3. 問い合わせフォーム（PHP）

本番サーバーは **PHP が動く静的ホスティング**（または `dist/` をドキュメントルートにした PHP 対応環境）が必要です。

```bash
cp public/contact/config.sample.php public/contact/config.php
```

`config.php` で宛先メール・送信元・許可ホストを設定します。

```php
'to_email' => 'real@example.com',
'from_email' => 'noreply@your-domain.com',
'allowed_hosts' => ['your-domain.com', 'www.your-domain.com'],
```

#### セキュリティ対策（実装済み）

- CSRF トークン（セッション・ワンタイム）
- SameSite=Strict / HttpOnly クッキー
- ハニーポット（隠しフィールド）
- 送信までの最短待ち時間チェック
- Origin / Referer / Host 検証
- IP ハッシュ単位のレート制限
- 入力長制限・メール形式検証
- メールヘッダインジェクション対策（改行除去・UTF-8 エンコード）
- `config.php` / `bootstrap.php` への直接アクセス拒否（`.htaccess`）
- エラー画面では内部詳細を出さず、コードのみ表示

ローカルの `astro preview` では PHP は動きません。フォーム検証は PHP 対応のローカルサーバー（例: `php -S localhost:8080 -t dist`）で行ってください。

## デプロイの目安

1. `npm run build`
2. `dist/` を公開ディレクトリへ配置
3. サーバー上で `contact/config.php` を配置（リポジトリには載せない）
4. HTTPS を有効化し、`allowed_hosts` を本番ドメインに合わせる
5. 必要に応じて SPF / DKIM を送信ドメインに設定

## 開発メモ

- 問い合わせの表示は `src/pages/contact/`（Astro）。送信処理は `public/contact/*.php` です。
- CMS 未接続時は `src/lib/fallback.ts` のデモ内容が表示されます。
