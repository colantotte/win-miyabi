# Win-Miyabi PowerShell インストーラー
# 使用方法:
#   iwr -useb https://raw.githubusercontent.com/colantotte/win-miyabi/main/scripts/install.ps1 | iex
# ローカル実行:
#   ./install.ps1

param(
    [switch]$SkipNodeJS,
    [switch]$SkipGit,
    [switch]$SkipGitHubCLI,
    [switch]$SkipWSL,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

# カラー出力ヘルパー
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) { Write-Output $args }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($Message) { Write-ColorOutput Green "  ✓ $Message" }
function Write-Warning2($Message) { Write-ColorOutput Yellow "  ⚠ $Message" }
function Write-Error2($Message) { Write-ColorOutput Red "  ✗ $Message" }
function Write-Info($Message) { Write-ColorOutput Cyan "  → $Message" }

# ヘッダー
Write-Output ""
Write-ColorOutput Cyan "🌸 Win-Miyabi インストーラー"
Write-ColorOutput Gray "  Beauty in Autonomous Development on Windows"
Write-Output ""
Write-Output "─────────────────────────────────────────"

# 管理者権限確認
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Warning2 "管理者権限なしで実行中です。"
    Write-ColorOutput Gray "    一部のインストールに失敗する場合があります。"
    Write-ColorOutput Gray "    管理者権限での実行を推奨します。"
    Write-Output ""
}

# PowerShellの実行ポリシーを設定
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force -ErrorAction SilentlyContinue
    Write-Success "実行ポリシー: RemoteSigned (CurrentUser)"
} catch {
    Write-Warning2 "実行ポリシーの設定をスキップしました"
}

Write-Output ""
Write-ColorOutput White "📋 依存パッケージの確認とインストール:"
Write-Output ""

# wingetの確認
$hasWinget = $null -ne (Get-Command winget -ErrorAction SilentlyContinue)

if (-not $hasWinget) {
    Write-Warning2 "winget が見つかりません。"
    Write-ColorOutput Gray "    Microsoft Store から 'アプリ インストーラー' をインストールしてください。"
    Write-ColorOutput Gray "    URL: https://aka.ms/getwinget"
    Write-Output ""
} else {
    Write-Success "winget: $(winget --version)"
}

# Node.js インストール
if (-not $SkipNodeJS) {
    $nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
    if ($nodeExists) {
        $nodeVersion = node --version
        Write-Success "Node.js: $nodeVersion"
    } else {
        Write-Info "Node.js をインストール中..."
        if ($hasWinget) {
            try {
                winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
                Write-Success "Node.js インストール完了"
            } catch {
                Write-Error2 "Node.js インストール失敗: https://nodejs.org からダウンロードしてください"
            }
        } else {
            Write-Error2 "Node.js 未インストール: https://nodejs.org/en/download/ からインストールしてください"
        }
    }
}

# Git インストール
if (-not $SkipGit) {
    $gitExists = $null -ne (Get-Command git -ErrorAction SilentlyContinue)
    if ($gitExists) {
        $gitVersion = git --version
        Write-Success "Git: $gitVersion"
    } else {
        Write-Info "Git をインストール中..."
        if ($hasWinget) {
            try {
                winget install Git.Git --accept-package-agreements --accept-source-agreements --silent
                Write-Success "Git インストール完了"
            } catch {
                Write-Error2 "Git インストール失敗: https://git-scm.com/download/win からインストールしてください"
            }
        } else {
            Write-Error2 "Git 未インストール: https://git-scm.com/download/win からインストールしてください"
        }
    }
}

# GitHub CLI インストール
if (-not $SkipGitHubCLI) {
    $ghExists = $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
    if ($ghExists) {
        $ghVersion = gh --version | Select-Object -First 1
        Write-Success "GitHub CLI: $ghVersion"
    } else {
        Write-Info "GitHub CLI をインストール中..."
        if ($hasWinget) {
            try {
                winget install GitHub.cli --accept-package-agreements --accept-source-agreements --silent
                Write-Success "GitHub CLI インストール完了"
            } catch {
                Write-Error2 "GitHub CLI インストール失敗: https://cli.github.com からインストールしてください"
            }
        } else {
            Write-Error2 "GitHub CLI 未インストール: https://cli.github.com からインストールしてください"
        }
    }
}

# Win-Miyabi インストール
Write-Output ""
Write-ColorOutput White "📥 Win-Miyabi をインストール中..."
Write-Output ""

$npmExists = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)
if ($npmExists) {
    try {
        npm install -g win-miyabi 2>&1
        Write-Success "Win-Miyabi インストール完了"
    } catch {
        Write-Error2 "Win-Miyabi インストール失敗"
        Write-ColorOutput Gray "    手動インストール: npm install -g win-miyabi"
    }
} else {
    Write-Error2 "npm が見つかりません。Node.js をインストール後に再実行してください。"
    exit 1
}

# 環境変数の設定案内
Write-Output ""
Write-Output "─────────────────────────────────────────"
Write-Output ""
Write-ColorOutput Cyan "🔑 次のステップ:"
Write-Output ""
Write-ColorOutput White "  1. 環境診断:"
Write-ColorOutput Gray "     win-miyabi check"
Write-Output ""
Write-ColorOutput White "  2. APIキー・GitHubトークンを設定:"
Write-ColorOutput Gray "     win-miyabi setup"
Write-Output ""
Write-ColorOutput White "  3. (推奨) WSL2のセットアップ:"
Write-ColorOutput Gray "     win-miyabi wsl guide"
Write-Output ""
Write-ColorOutput White "  4. Miyabiを起動:"
Write-ColorOutput Gray "     win-miyabi run"
Write-Output ""
Write-ColorOutput Cyan "🌸 Win-Miyabi - Beauty in Autonomous Development on Windows"
Write-Output ""
