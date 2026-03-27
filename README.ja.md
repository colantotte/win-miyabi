# 🌸 Win-Miyabi

**Miyabi for Windows** - Windows PCでMiyabiを簡単に使えるようにするブリッジツール

## Win-Miyabiとは？

Win-Miyabiは、自律型AI開発フレームワーク [Miyabi](https://github.com/ShunsukeHayashi/Miyabi) をWindows PCで簡単に使えるようにするブリッジパッケージです。

以下を自動化します：
- **依存パッケージの自動インストール** - Node.js, Git, GitHub CLI, Claude Code を winget/Chocolatey/Scoop 経由で一括インストール
- **環境変数の永続設定** - ANTHROPIC_API_KEY と GITHUB_TOKEN を PowerShell プロファイルに安全に保存
- **WSL2統合** - 最適なパフォーマンスのためWSL2経由でMiyabiを実行
- **Windows Terminalテーマ** - 桜をモチーフにした美しいターミナルテーマ

## クイックスタート

### 方法A: PowerShell インストーラー (推奨)

```powershell
# PowerShellで実行 (管理者権限推奨)
iwr -useb https://raw.githubusercontent.com/colantotte/win-miyabi/main/scripts/install.ps1 | iex
```

### 方法B: clone → npm install (推奨)

```powershell
git clone --depth=1 https://github.com/colantotte/win-miyabi.git $env:TEMP\win-miyabi
npm install -g $env:TEMP\win-miyabi
win-miyabi check    # 環境診断
win-miyabi install  # 不足パッケージのインストール
win-miyabi setup    # APIキーの設定
win-miyabi run      # Miyabiを起動
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `win-miyabi check` | 環境診断 (Node.js/Git/Claude Code/環境変数/WSL2) |
| `win-miyabi install` | 不足パッケージを winget/Chocolatey/Scoop で自動インストール |
| `win-miyabi setup` | ANTHROPIC_API_KEY と GITHUB_TOKEN を対話形式で設定 |
| `win-miyabi run [引数]` | Miyabiを起動 (WSL2/Windowsネイティブを自動選択) |
| `win-miyabi wsl status` | WSL2のインストール状況と利用可能なディストリビューションを表示 |
| `win-miyabi wsl install` | WSL2内にMiyabiをインストール |
| `win-miyabi wsl guide` | WSL2インストール手順のガイド |

## 動作環境

- Windows 10 (Build 19041以降) または Windows 11
- Node.js 18以上
- PowerShell 5.1以上 (PowerShell 7以上を推奨)

## WSL2について (推奨)

最良のパフォーマンスのために、WSL2内でMiyabiを使用することをお勧めします：

```powershell
# WSL2インストール (管理者権限で実行)
wsl --install

# 再起動後、WSL2にMiyabiをインストール
win-miyabi wsl install

# WSL2経由で自動的にMiyabiを起動
win-miyabi run
```

## セットアップガイド

### ステップ1: Win-Miyabiのインストール

```powershell
npm install -g win-miyabi
```

### ステップ2: 環境診断

```powershell
win-miyabi check
```

出力例：
```
🩺 Win-Miyabi 環境診断

📋 プラットフォーム情報:
  OS: windows (10.0.22621)
  PowerShell: 7.4.2

📦 依存パッケージ:
  ✓ Node.js (v22.0.0)
  ✓ Git (git version 2.44.0)
  ✗ GitHub CLI (gh) - 未インストール
    インストール: winget install GitHub.cli
  ✗ Claude Code - 未インストール
    インストール: npm install -g @anthropic-ai/claude-code

🔑 環境変数:
  ✗ ANTHROPIC_API_KEY: 未設定
  ✗ GITHUB_TOKEN: 未設定
```

### ステップ3: 不足パッケージのインストール

```powershell
win-miyabi install
```

### ステップ4: APIキーの設定

```powershell
win-miyabi setup
```

APIキーの取得方法：
- **ANTHROPIC_API_KEY**: https://console.anthropic.com → Settings → API Keys
- **GITHUB_TOKEN**: https://github.com/settings/tokens → Generate new token (repo, workflow スコープ)

### ステップ5: Miyabiを起動

```powershell
win-miyabi run
```

## Windows Terminalテーマ

Win-Miyabiには桜をモチーフにした美しい「Miyabi」カラーテーマが含まれています。

有効にする方法：

```powershell
# フラグメントディレクトリを作成
$fragmentDir = "$env:LOCALAPPDATA\Microsoft\Windows Terminal\Fragments\win-miyabi"
New-Item -ItemType Directory -Force -Path $fragmentDir

# テーマファイルをコピー
Copy-Item "templates\windows-terminal-settings-fragment.json" "$fragmentDir\settings.json"
```

Windows Terminalを再起動すると「Win-Miyabi (PowerShell)」プロファイルが追加されます。

## よくある質問

### Q: PowerShellで「このスクリプトは実行できません」と表示される

PowerShellの実行ポリシーを変更してください：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q: wingetが見つからない

Microsoft Storeで「アプリ インストーラー」を検索してインストールしてください。または https://aka.ms/getwinget からダウンロードできます。

### Q: WSL2とWindowsネイティブのどちらを使うべき？

WSL2を推奨します。Claude CodeはLinux環境向けに最適化されており、WSL2内での動作が最も安定しています。

### Q: ANTHROPIC_API_KEYを設定したのに反映されない

環境変数の変更を反映させるには、新しいターミナルを開いてください。現在のターミナルには即時反映されません。

## ライセンス

Apache-2.0 © Win-Miyabi Contributors
