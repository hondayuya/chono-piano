# CSS 指示書（chono-piano）

kakko プロジェクトの規約を Astro + CSS Variables 向けに短縮したものです。

## 単位（rem ベース）

- `html` の `font-size` 既定は **10px**（`1.6rem ≈ 16px`）
- ビューポートに応じてルート rem がスケールする（デザイン幅 PC 1440 / SP 390）
- **width / height / margin / padding / font-size は基本 rem**
- **line-height は比率（1.75 など）または単位なし**
- **letter-spacing は em**
- **font-weight は数値（400 / 500）**
- **ブレイクポイントの `@media` は必ず px**（rem だとルートスケールで閾値が動くため）

換算の目安:

| 意図する大きさ | rem |
|---|---|
| 10px | 1rem |
| 14px | 1.4rem |
| 16px | 1.6rem |
| 24px | 2.4rem |

## ブレイクポイント

| 名前 | 値 | 用途 |
|---|---|---|
| xs | max 389px | 極小 SP |
| s | max 767px | スマホ（ハンバーガー） |
| m | max 1023px | タブレット |
| l | max 1439px | PC デザイン幅未満 |
| xl | min 1600px | 大型（ルート rem 上限） |

定義は `src/styles/global.css` の `:root`（`--bp-*`）と `/design/` を参照。

## 命名（今後の追加分）

BEM + 接頭辞を推奨（kakko 準拠）:

- `u-` utility
- `c-` 再利用コンポーネント
- `s-` セクション / ヘッダー・フッター
- `l-` レイアウト（inner など）

既存クラス（`site-header` など）は段階的に移行する。
