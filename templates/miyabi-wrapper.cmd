@echo off
:: Win-Miyabi Wrapper for Windows CMD
:: miyabi コマンドのWindows CMDラッパー

setlocal

:: 環境変数確認
if "%ANTHROPIC_API_KEY%"=="" (
    echo 警告: ANTHROPIC_API_KEY が設定されていません
    echo win-miyabi setup で設定してください
    echo.
)

if "%GITHUB_TOKEN%"=="" (
    echo 警告: GITHUB_TOKEN が設定されていません
    echo win-miyabi setup で設定してください
    echo.
)

:: miyabi を実行
miyabi %*

endlocal
