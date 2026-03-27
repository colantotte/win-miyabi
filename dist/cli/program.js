/**
 * CLIプログラム定義
 * Commander.jsによるコマンド構造の定義
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { runCheck } from './commands/check.js';
import { runInstall } from './commands/install.js';
import { runEnvWizard } from '../env/env-wizard.js';
import { runMiyabi } from './commands/run.js';
import { showWSLStatus, installMiyabiToWSL, guideWSLInstall } from './commands/wsl.js';
export function createProgram() {
    const program = new Command();
    program
        .name('win-miyabi')
        .description('🌸 Miyabi for Windows - Windows PCでMiyabiを簡単に使えるブリッジツール')
        .version('0.1.0');
    // check コマンド
    program
        .command('check')
        .description('環境診断 - Node.js/Git/Claude Code/環境変数/WSL2の状態を確認')
        .action(async () => {
        await runCheck();
    });
    // install コマンド
    program
        .command('install')
        .description('依存パッケージの自動インストール (Windows専用: winget/Chocolatey/Scoop使用)')
        .action(async () => {
        await runInstall();
    });
    // setup コマンド
    program
        .command('setup')
        .description('環境変数セットアップウィザード (ANTHROPIC_API_KEY, GITHUB_TOKEN)')
        .action(async () => {
        await runEnvWizard();
    });
    // run コマンド
    program
        .command('run [args...]')
        .description('miyabi を実行 (Windows/WSL2を自動選択)')
        .option('--wsl', 'WSL2経由で実行')
        .option('--native', 'Windows上でネイティブ実行')
        .option('--distro <name>', '使用するWSL2ディストリビューション')
        .action(async (args, options) => {
        await runMiyabi(args, {
            useWSL: options.wsl,
            native: options.native,
            distro: options.distro,
        });
    });
    // wsl コマンドグループ
    const wslCmd = program
        .command('wsl')
        .description('WSL2管理 (サブコマンド: status, install, guide)');
    wslCmd
        .command('status')
        .description('WSL2のインストール状態とディストリビューションを表示')
        .action(() => {
        showWSLStatus();
    });
    wslCmd
        .command('install')
        .description('WSL2のデフォルトディストリビューションにMiyabiをインストール')
        .option('--distro <name>', '対象ディストリビューション名')
        .action(async (options) => {
        await installMiyabiToWSL(options.distro);
    });
    wslCmd
        .command('guide')
        .description('WSL2のインストール手順を表示')
        .action(() => {
        guideWSLInstall();
    });
    // デフォルト動作: 引数なしの場合はhelpを表示
    program.action(() => {
        console.log(chalk.cyan('\n🌸 Win-Miyabi - Beauty in Autonomous Development on Windows\n'));
        console.log(chalk.white('使い方:'));
        console.log(chalk.gray('  win-miyabi check    - 環境診断'));
        console.log(chalk.gray('  win-miyabi install  - 依存パッケージのインストール'));
        console.log(chalk.gray('  win-miyabi setup    - 環境変数の設定'));
        console.log(chalk.gray('  win-miyabi run      - Miyabiを起動'));
        console.log(chalk.gray('  win-miyabi wsl      - WSL2管理\n'));
        console.log(chalk.gray('詳細: win-miyabi --help\n'));
    });
    return program;
}
//# sourceMappingURL=program.js.map