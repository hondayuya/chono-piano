# チョウノウ調律所 / Labo CHONO

ピアノ調律師・張能康博氏の公式サイト用プロジェクトです。  
[HP案 PDF（2026.6.18）](./チョウノウ調律所HP案'26.6.18.pdf) の構成をもとにしています。

## 技術構成

| 領域 | 技術 |
|------|------|
| サイト本体 | [Astro](https://astro.build/)（静的ビルド） |
| CMS | [microCMS](https://microcms.io/) |
| 問い合わせ | 静的 HTML + PHP（`mail()`） |
| CSS | rem ベース（html 10px）+ px ブレイクポイント（[指示書](./docs/style_guide.md)） |

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
| `/design/` | デザインシステム（ターゲット・コンセプト・rem/BP・配色・テキスト・コンポーネント／開発用・noindex） |

## セットアップ

### 1. Node.js

Node.js **22.12 以上**が必要です。

```bash
npm install
cp .env.example .env
```

`.env` に microCMS のサービスドメインと API キーを設定します。未設定、または `USE_LOCAL_MOCK=true` のときは `src/mocks/` と `src/lib/fallback.ts` のデモデータで表示・ビルドできます。

```bash
npm run dev
npm run build

# CMS からローカルモックを更新（要 .env）
npm run update-mocks
```

ビルド成果物は `dist/` です。問い合わせ画面は Astro が HTML を生成し、`public/contact/` 配下の PHP も同じディレクトリへコピーされます。

`/design/` 以下の検証ページは **本番ビルドでは除外**されます（`astro dev` では利用可）。ビルド成果物に含めたい場合のみ `INCLUDE_DESIGN_PAGES=true` を指定してください。

### 2. microCMS API（接続対象）

CMS から取得するのは次の **2 API のみ**です（エンドポイント名は `src/config/microcms.ts`）。

#### リスト形式

**`news`（お知らせ）**

| フィールド | 種別 |
|-----------|------|
| `title` | テキスト |
| `content` | リッチエディタ |
| `thumbnail` | 画像 |

**`sounds`（音源・動画リンク）**

| フィールド | 種別 |
|-----------|------|
| `title` | テキスト |
| `url` | テキスト |
| `thumbnail` | 画像 |

サイト設定・プロフィール・Labo 記事・用語集は現状ローカル（`fallback.ts`）です。ビルド時に microCMS 画像は `public/_generated/microcms/` へダウンロードされ、本番ではローカルパスで配信されます。

公開時の再ビルドは GitHub Actions（`repository_dispatch` / `microcms-publish`）→ FTP デプロイです。Webhook 設定の詳細は `.github/workflows/deploy-production.yml` を参照してください。

### 3. 問い合わせフォーム（PHP）

本番サーバーは **PHP が動く静的ホスティング**（または `dist/` をドキュメントルートにした PHP 対応環境）が必要です。

宛先・送信元・許可ホスト・自動返信は `public/contact/config.php` で設定します（リポジトリに含めています）。通知メール成功後、訪問者へ自動返信を送ります（`auto_reply_enabled`）。

```php
'to_email' => 'yuya.honda33@gmail.com',
'from_email' => 'noreply@chono-piano.com',
'allowed_hosts' => [
    'chono-piano.com',
    'www.chono-piano.com',
    'stg.chono-piano.com',
],
```

本番: https://chono-piano.com/ ／ ステージング: https://stg.chono-piano.com/

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

1. GitHub Secrets に `MICROCMS_*` と `FTP_*` を登録
2. `main` への push、または microCMS 公開 Webhook で Actions がビルド→FTP
3. サーバー上で PHP が動き、`contact/config.php` の宛先・許可ホストが本番ドメインと合っていることを確認
4. HTTPS を有効化し、`allowed_hosts` を本番ドメインに合わせる
5. 必要に応じて SPF / DKIM を送信ドメインに設定

手動の場合は `npm run build` 後に `dist/` を公開ディレクトリへ配置してください。

## 開発メモ

- 問い合わせの表示は `src/pages/contact/`（Astro）。送信処理は `public/contact/*.php` です。
- ローカル開発は `USE_LOCAL_MOCK=true` 推奨。CMS 未接続時は `src/mocks/` + `fallback.ts` です。
