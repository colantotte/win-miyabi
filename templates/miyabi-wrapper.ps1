# Win-Miyabi Wrapper for PowerShell
# miyabi コマンドのPowerShellラッパー

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# 環境変数確認
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Warning "ANTHROPIC_API_KEY が設定されていません"
    Write-Host "  win-miyabi setup で設定してください" -ForegroundColor Gray
    Write-Host ""
}

if (-not $env:GITHUB_TOKEN) {
    Write-Warning "GITHUB_TOKEN が設定されていません"
    Write-Host "  win-miyabi setup で設定してください" -ForegroundColor Gray
    Write-Host ""
}

# miyabi を実行
& miyabi @Arguments
