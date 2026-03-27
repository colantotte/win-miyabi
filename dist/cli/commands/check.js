/**
 * win-miyabi check コマンド
 * 環境診断を実行して結果を表示
 */
import chalk from 'chalk';
import { getPlatformInfo } from '../../platform/windows-detector.js';
import { checkDependencies, getMissingRequired } from '../../installer/dependency-checker.js';
import { checkEnvVars } from '../../env/env-wizard.js';
import { getWSLStatus } from '../../wsl/wsl-detector.js';
import { detectPackageManagers } from '../../installer/installer-strategy.js';
export async function runCheck() {
    console.log(chalk.cyan('\n🩺 Win-Miyabi 環境診断\n'));
    console.log(chalk.gray('─'.repeat(50)));
    // 1. プラットフォーム情報
    console.log(chalk.white('\n📋 プラットフォーム情報:'));
    const platform = getPlatformInfo();
    console.log(chalk.gray(`  OS: ${platform.type} (${platform.osRelease})`));
    if (platform.powershellVersion) {
        console.log(chalk.gray(`  PowerShell: ${platform.powershellVersion}`));
    }
    if (platform.windowsTerminal) {
        console.log(chalk.green('  ✓ Windows Terminal 使用中'));
    }
    if (platform.isWSL) {
        console.log(chalk.green('  ✓ WSL2環境で動作中'));
    }
    // 2. 依存パッケージ確認
    console.log(chalk.white('\n📦 依存パッケージ:'));
    const depsReport = await checkDependencies();
    for (const dep of depsReport.dependencies) {
        if (dep.available) {
            const versionStr = dep.version ? chalk.gray(` (${dep.version})`) : '';
            console.log(chalk.green(`  ✓ ${dep.name}${versionStr}`));
        }
        else if (dep.required) {
            console.log(chalk.red(`  ✗ ${dep.name} - 未インストール`));
            console.log(chalk.gray(`    インストール: ${dep.installHint}`));
        }
        else {
            console.log(chalk.yellow(`  ⚠ ${dep.name} - 未インストール (オプション)`));
            console.log(chalk.gray(`    インストール: ${dep.installHint}`));
        }
    }
    // 3. 環境変数確認
    console.log(chalk.white('\n🔑 環境変数:'));
    const envStatus = checkEnvVars();
    for (const env of envStatus) {
        if (env.isValid) {
            console.log(chalk.green(`  ✓ ${env.envVar}: ${env.currentValue}`));
        }
        else if (env.isSet) {
            console.log(chalk.yellow(`  ⚠ ${env.envVar}: ${env.currentValue} (形式が不正)`));
        }
        else {
            console.log(chalk.red(`  ✗ ${env.envVar}: 未設定`));
        }
    }
    // 4. WSL2確認 (Windowsの場合のみ)
    if (platform.isWindows) {
        console.log(chalk.white('\n🐧 WSL2:'));
        const wslStatus = getWSLStatus();
        if (wslStatus.installed) {
            console.log(chalk.green(`  ✓ WSL インストール済み (バージョン: ${wslStatus.version || '不明'})`));
            if (wslStatus.distros.length > 0) {
                for (const distro of wslStatus.distros) {
                    const defaultMark = distro.isDefault ? chalk.cyan(' (デフォルト)') : '';
                    const stateMark = distro.state === 'Running' ? chalk.green(' ●') : chalk.gray(' ○');
                    console.log(chalk.gray(`    ${stateMark} ${distro.name} (WSL${distro.version})${defaultMark}`));
                }
            }
        }
        else {
            console.log(chalk.yellow('  ⚠ WSL 未インストール (オプション)'));
            console.log(chalk.gray('    インストール: wsl --install (管理者PowerShellで実行)'));
        }
        // パッケージマネージャー確認
        console.log(chalk.white('\n📥 パッケージマネージャー:'));
        const managers = detectPackageManagers();
        for (const manager of managers) {
            if (manager.available) {
                console.log(chalk.green(`  ✓ ${manager.type}${manager.version ? ` (${manager.version})` : ''}`));
            }
            else {
                console.log(chalk.gray(`  - ${manager.type}: 未インストール`));
            }
        }
    }
    // 5. サマリー
    console.log(chalk.gray('\n' + '─'.repeat(50)));
    const missing = getMissingRequired(depsReport);
    const missingEnv = envStatus.filter(e => !e.isValid);
    if (missing.length === 0 && missingEnv.length === 0) {
        console.log(chalk.green('\n✨ 全ての必須要件が満たされています！'));
        console.log(chalk.white('  win-miyabi run でMiyabiを起動できます。\n'));
    }
    else {
        if (missing.length > 0) {
            console.log(chalk.red(`\n✗ 不足している必須パッケージ: ${missing.map(d => d.name).join(', ')}`));
            console.log(chalk.white('  win-miyabi install で自動インストールできます。'));
        }
        if (missingEnv.length > 0) {
            console.log(chalk.red(`✗ 未設定の環境変数: ${missingEnv.map(e => e.envVar).join(', ')}`));
            console.log(chalk.white('  win-miyabi setup で設定できます。\n'));
        }
    }
}
//# sourceMappingURL=check.js.map