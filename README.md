# 星盤解読（ホロスコープ）

西洋占星術を「日本語で」「仕組みから」「AI解説付きで」体験できるWebサービスです。

## 概要

- **キャッチコピー**: 生まれた瞬間の星空が、あなたの運命を映します
- **ターゲット**: 20〜30代女性、星座占いは見るがBirth Chartは初めて

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| DB | Supabase |
| 決済 | Stripe（都度課金のみ） |
| AI（基本） | GPT-4o-mini |
| AI（詳細） | GPT-4o |
| 緯度経度変換 | OpenCage |
| 天文計算 | Swiss Ephemeris（astronomia.js） |
| ホスティング | Vercel |

## セットアップ

### 1. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集して、各サービスのAPIキーを設定してください。

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # メインレイアウトグループ
│   ├── result/[id]/       # 結果ページ
│   └── api/               # APIルート
│       ├── horoscope/     # ホロスコープ計算・取得
│       ├── checkout/      # Stripe Checkout
│       ├── webhook/       # Stripe Webhook
│       └── og/            # OGP画像生成
├── components/
│   ├── ui/                # 汎用UIコンポーネント
│   ├── layout/            # レイアウトコンポーネント
│   └── features/          # 機能別コンポーネント
├── lib/                   # ライブラリ・ユーティリティ
├── hooks/                 # カスタムフック
├── types/                 # TypeScript型定義
├── constants/             # 定数定義
└── utils/                 # ユーティリティ関数
```

## 画面構成

1. **LP/入力フォーム**: 生年月日・出生時刻・出生地を入力
2. **ローディング**: 星の配置を計算中の演出
3. **基本解説（無料）**: 10項目の解説（GPT-4o-mini）
4. **詳細解説（有料500円）**: 18項目の解説（GPT-4o）

## デザインシステム

- **背景色**: #0a0e1a（深い紺）
- **アクセント**: #4eb8a1（エメラルド）
- **ゴールド**: #d4af55
- **本文フォント**: Zen Kaku Gothic Antique
- **装飾フォント**: Zen Antique

## ライセンス

© 2025 星盤解読 All rights reserved.
