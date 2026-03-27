/**
 * win-miyabi run コマンド
 * miyabi を Windows / WSL2 経由で実行するプロキシ
 */
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { isNativeWindows, isWSL } from '../../platform/windows-detector.js';
import { isCommandAvailable } from '../../platform/shell-executor.js';
import { runMiyabiInWSL } from '../../wsl/wsl-bridge.js';
import { isWSL2Available, isMiyabiInstalledInWSL } from '../../wsl/wsl-detector.js';
/**
 * miyabi を実行 (プラットフォームに応じて自動選択)
 */
export async function runMiyabi(args, options = {}) {
    // WSL2環境内で実行されている場合はそのままmiyabiを実行
    if (isWSL()) {
        executeMiyabiNative(args);
        return;
    }
    // macOS/Linuxの場合はそのまま実行
    if (!isNativeWindows()) {
        executeMiyabiNative(args);
        return;
    }
    // Windows の場合: WSL2 vs ネイティブ を選択
    if (options.useWSL || (!options.native && isWSL2Available())) {
        // WSL2を優先
        const miyabiInWSL = isMiyabiInstalledInWSL(options.distro);
        if (miyabiInWSL) {
            console.log(chalk.cyan('🐧 WSL2 経由でMiyabiを実行します...'));
            const exitCode = runMiyabiInWSL(args, { distro: options.distro });
            process.exit(exitCode);
        }
        else {
            console.log(chalk.yellow('⚠ WSL2内にMiyabiがインストールされていません。'));
            console.log(chalk.gray('  win-miyabi wsl install でWSL2にMiyabiをインストールできます。'));
            console.log(chalk.gray('  または --native フラグでWindows上で直接実行します。\n'));
            if (!options.native) {
                // フォールバック: ネイティブWindowsで実行
                console.log(chalk.cyan('⚡ ネイティブWindowsモードで実行します...'));
                executeMiyabiNative(args);
            }
        }
    }
    else {
        // ネイティブWindowsで実行
        if (!isCommandAvailable('miyabi')) {
            console.log(chalk.red('✗ miyabi コマンドが見つかりません。'));
            console.log(chalk.gray('  npm install -g miyabi でインストールしてください。'));
            process.exit(1);
        }
        executeMiyabiNative(args);
    }
}
/**
 * ネイティブ環境でmiyabiを実行
 */
function executeMiyabiNative(args) {
    const result = spawnSync('miyabi', args, {
        stdio: 'inherit',
        shell: isNativeWindows() ? 'cmd.exe' : undefined,
    });
    process.exit(result.status ?? 1);
}
