/**
 * win-miyabi wsl コマンド
 * WSL2のセットアップ・管理
 */
import chalk from 'chalk';
import { getWSLStatus, isWSL2Available, isMiyabiInstalledInWSL } from '../../wsl/wsl-detector.js';
import { installMiyabiInWSL, execInWSL } from '../../wsl/wsl-bridge.js';
import { isNativeWindows } from '../../platform/windows-detector.js';
/**
 * WSL2の状態を表示
 */
export function showWSLStatus() {
    if (!isNativeWindows()) {
        console.log(chalk.yellow('⚠ このコマンドはWindows専用です。'));
        return;
    }
    console.log(chalk.cyan('\n🐧 WSL2 状態\n'));
    const status = getWSLStatus();
    if (!status.installed) {
        console.log(chalk.red('✗ WSL がインストールされていません'));
        console.log(chalk.white('\nインストール方法:'));
        console.log(chalk.gray('  1. 管理者権限でPowerShellを開く'));
        console.log(chalk.gray('  2. wsl --install を実行'));
        console.log(chalk.gray('  3. PCを再起動'));
        return;
    }
    console.log(chalk.green(`✓ WSL インストール済み (v${status.version || '不明'})`));
    if (status.distros.length === 0) {
        console.log(chalk.yellow('⚠ ディストリビューションが見つかりません'));
        console.log(chalk.gray('  wsl --install -d Ubuntu でUbuntuをインストールできます'));
        return;
    }
    console.log(chalk.white(`\nディストリビューション一覧 (${status.distros.length}個):`));
    for (const distro of status.distros) {
        const defaultMark = distro.isDefault ? chalk.cyan(' ← デフォルト') : '';
        const stateColor = distro.state === 'Running' ? chalk.green : chalk.gray;
        const stateDot = distro.state === 'Running' ? '●' : '○';
        console.log(`  ${stateColor(stateDot)} ${distro.name} (WSL${distro.version})${defaultMark}`);
        // Miyabiのインストール状況を確認
        const miyabiInstalled = isMiyabiInstalledInWSL(distro.name);
        if (miyabiInstalled) {
            console.log(chalk.green(`      ✓ miyabi インストール済み`));
        }
        else {
            console.log(chalk.gray(`      - miyabi 未インストール`));
        }
    }
    console.log('');
}
/**
 * WSL2にMiyabiをインストール
 */
export async function installMiyabiToWSL(distro) {
    if (!isNativeWindows()) {
        console.log(chalk.yellow('⚠ このコマンドはWindows専用です。'));
        return;
    }
    if (!isWSL2Available()) {
        console.log(chalk.red('✗ WSL2が利用できません。'));
        console.log(chalk.gray('  win-miyabi wsl status でWSL2の状態を確認してください。'));
        return;
    }
    const targetDistro = distro || getWSLStatus().defaultDistro;
    console.log(chalk.cyan(`\n🔧 ${targetDistro || 'デフォルト'} ディストリビューションにMiyabiをインストール中...\n`));
    // 既にインストール済みかチェック
    if (isMiyabiInstalledInWSL(targetDistro || undefined)) {
        console.log(chalk.green('✓ Miyabiは既にインストールされています'));
        // バージョン確認
        const versionResult = execInWSL('miyabi --version', { distro: targetDistro || undefined });
        if (versionResult.success) {
            console.log(chalk.gray(`  バージョン: ${versionResult.stdout}`));
        }
        return;
    }
    const success = installMiyabiInWSL(targetDistro || undefined);
    if (success) {
        console.log(chalk.green('\n✨ WSL2へのMiyabiインストール完了！'));
        console.log(chalk.white('  win-miyabi run でMiyabiを起動できます (自動的にWSL2経由で実行されます)\n'));
    }
    else {
        console.log(chalk.red('\n✗ インストールに失敗しました'));
        console.log(chalk.gray('  手動でインストール: wsl -- npm install -g miyabi\n'));
    }
}
/**
 * WSL2のインストールをガイド
 */
export function guideWSLInstall() {
    console.log(chalk.cyan('\n🐧 WSL2 インストールガイド\n'));
    console.log(chalk.white('WSL2 (Windows Subsystem for Linux 2) は、Windows上でLinuxを実行できる機能です。'));
    console.log(chalk.gray('MiyabiはWSL2環境での動作が推奨されます。\n'));
    console.log(chalk.white('インストール手順:'));
    console.log(chalk.gray('1. 管理者権限でPowerShellを開く'));
    console.log(chalk.gray('   (スタートメニューで PowerShell を右クリック → 管理者として実行)\n'));
    console.log(chalk.gray('2. 以下のコマンドを実行:'));
    console.log(chalk.white('   wsl --install\n'));
    console.log(chalk.gray('3. PCを再起動\n'));
    console.log(chalk.gray('4. Ubuntuが自動的に起動するので、ユーザー名とパスワードを設定\n'));
    console.log(chalk.gray('5. win-miyabi wsl install でMiyabiをWSL2にインストール\n'));
    console.log(chalk.yellow('💡 ヒント: Windows 11では標準でWSL2が推奨されます'));
    console.log(chalk.yellow('   Windows 10の場合はビルド19041以降が必要です\n'));
}
//# sourceMappingURL=wsl.js.map