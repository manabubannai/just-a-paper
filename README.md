# Just a Paper

究極にシンプルな執筆体験 - PC画面に一枚の紙だけを映す

## 概要

「Just a Paper」は、執筆に集中できる環境を提供する最小限のテキストエディタです。余計な機能を排除し、紙に書くようなシンプルな体験を実現します。

## 機能

- **フォント切り替え**: 明朝体、ゴシック体、等幅フォントから選択可能
- **行間調整**: 0.8〜2.0の範囲で自由に調整
- **横幅調整**: 執筆エリアの幅を50%〜100%で調整（5%刻み）
- **美しいデザイン**: PenCake風の温かみのある外観

## 技術仕様

- **フレームワーク**: Electron 29
- **言語**: Vanilla JavaScript, HTML5, CSS3
- **推奨環境**: Node.js 20 LTS

## インストール

```bash
# 依存関係のインストール
npm install

# アプリケーションの起動
npm start
```

## ビルド

```bash
# 全プラットフォーム向けビルド
npm run dist

# プラットフォーム別ビルド
npm run build -- --mac
npm run build -- --win
npm run build -- --linux
```

## 開発

```bash
# ESLintでコード品質チェック
npm run lint

# Prettierでコードフォーマット
npm run format
```

## 動作要件

- Windows 11以降
- macOS Sonoma以降
- Ubuntu 24.04以降

## パフォーマンス

- 起動時間: 2秒以内
- 10,000文字入力時でも50FPS以上を維持
- オフライン動作対応

## セキュリティ

- Context Isolation有効
- Node Integration無効
- ローカルストレージのみ使用（ネットワーク通信なし）

## ライセンス

MIT License

## 作者

Vibe Coding Competition Entry

---

Enjoy your writing experience with Just a Paper!