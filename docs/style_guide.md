# CSS 指示書（chono-piano）

kakko プロジェクトの規約を Astro + CSS Variables 向けに短縮したものです。

## 単位（rem ベース）

- `html` の `font-size` 既定は **11px**（`1.6rem ≈ 17.6px`）
- `body` に `font-size: 1.6rem` を指定（ルート値の継承で本文が小さくならないようにする）
- ビューポートに応じてルート rem がスケールする（デザイン幅 PC 1440 / SP 390）
- **width / height / margin / padding / font-size は基本 rem**
- **line-height は比率（1.75 など）または単位なし**
- **letter-spacing は em**
- **font-weight は数値（400 / 500）**
- **ブレイクポイントの `@media` は必ず px**（rem だとルートスケールで閾値が動くため）

換算の目安（html 11px 時）:

| 意図する大きさ | rem |
|---|---|
| ≈11px | 1rem |
| ≈16px | 1.45rem |
| ≈17.6px（本文） | 1.6rem |
| ≈22px | 2rem |
| ≈26px | 2.4rem |

## ブレイクポイント

| 名前 | 値 | 用途 |
|---|---|---|
| xs | max 389px | 極小 SP |
| s | max 767px | スマホ（ハンバーガー） |
| m | max 1023px | タブレット |
| l | max 1439px | PC デザイン幅未満 |
| xl | min 1600px | 大型（ルート rem 上限） |

定義は `src/styles/global.css` の `:root`（`--bp-*`）と `/design/` を参照。

余白スケール（`--space-*` / `--gutter`）は従来比 **+20%**。

## Webフォント

| 役割 | 書体 | 読み込み |
|---|---|---|
| Brand（ヘッダーサイト名） | Shippori Mincho | Google Fonts |
| Display（見出し） | Shippori Mincho | Google Fonts |
| Body（本文） | Zen Kaku Gothic New | Google Fonts |

- 定義・URL: `src/lib/fonts.ts`
- 注入: `src/layouts/BaseLayout.astro`
- 見出しの詰め: `font-feature-settings: "palt"`（`--font-feature-display`）＋ `font-variant-east-asian: proportional-width`

## 命名（今後の追加分）

BEM + 接頭辞を推奨（kakko 準拠）:

- `u-` utility
- `c-` 再利用コンポーネント
- `s-` セクション / ヘッダー・フッター
- `l-` レイアウト（inner など）

既存クラス（`site-header` など）は段階的に移行する。
