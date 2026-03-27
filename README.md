# 🌸 Win-Miyabi

**Miyabi for Windows** - Windows PCでMiyabiを簡単に使えるようにするブリッジツール

[日本語](README.ja.md) | English

## What is Win-Miyabi?

Win-Miyabi is a bridge package that enables [Miyabi](https://github.com/ShunsukeHayashi/Miyabi) — the autonomous AI development framework — to run seamlessly on Windows PCs.

It handles:
- Automatic installation of dependencies (Node.js, Git, GitHub CLI, Claude Code) via winget/Chocolatey/Scoop
- Environment variable setup (ANTHROPIC_API_KEY, GITHUB_TOKEN) with PowerShell profile persistence
- WSL2 integration for optimal performance
- Windows Terminal theme for a beautiful experience

## Quick Start

### Option A: PowerShell Installer (Recommended)

```powershell
# Run in PowerShell (as Administrator recommended)
iwr -useb https://raw.githubusercontent.com/colantotte/win-miyabi/main/scripts/install.ps1 | iex
```

### Option B: npm

```powershell
npm install -g win-miyabi
win-miyabi check    # Diagnose environment
win-miyabi install  # Install missing packages
win-miyabi setup    # Configure API keys
win-miyabi run      # Launch Miyabi
```

## Commands

| Command | Description |
|---------|-------------|
| `win-miyabi check` | Diagnose environment (Node.js, Git, Claude Code, env vars, WSL2) |
| `win-miyabi install` | Auto-install missing dependencies via winget/Chocolatey/Scoop |
| `win-miyabi setup` | Interactive wizard to set ANTHROPIC_API_KEY and GITHUB_TOKEN |
| `win-miyabi run [args...]` | Run Miyabi (auto-selects WSL2 or native Windows) |
| `win-miyabi wsl status` | Show WSL2 installation status and distributions |
| `win-miyabi wsl install` | Install Miyabi into WSL2 |
| `win-miyabi wsl guide` | Step-by-step WSL2 installation guide |

## Requirements

- Windows 10 (Build 19041+) or Windows 11
- Node.js 18+
- PowerShell 5.1+ (PowerShell 7+ recommended)

## WSL2 (Recommended)

For the best experience, using Miyabi inside WSL2 is recommended:

```powershell
# Install WSL2 (run as Administrator)
wsl --install

# After restart, install Miyabi in WSL2
win-miyabi wsl install

# Run Miyabi via WSL2 automatically
win-miyabi run
```

## Windows Terminal Theme

Win-Miyabi includes a beautiful "Miyabi" color scheme for Windows Terminal.

Copy the theme file to enable it:
```powershell
$fragmentDir = "$env:LOCALAPPDATA\Microsoft\Windows Terminal\Fragments\win-miyabi"
New-Item -ItemType Directory -Force -Path $fragmentDir
Copy-Item "templates\windows-terminal-settings-fragment.json" "$fragmentDir\settings.json"
```

Restart Windows Terminal to see the new "Win-Miyabi (PowerShell)" profile.

## License

Apache-2.0 © Win-Miyabi Contributors
