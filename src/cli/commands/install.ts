/**
 * win-miyabi install コマンド
 * 不足している依存パッケージを自動インストール
 */
import chalk from 'chalk';
import ora from 'ora';
import { checkDependencies, getMissingRequired } from '../../installer/dependency-checker.js';
import { installPackage, PACKAGE_DEFINITIONS, detectPackageManagers } from '../../installer/installer-strategy.js';
import { isNativeWindows } from '../../platform/windows-detector.js';

const PACKAGE_MAP: Record<string, keyof typeof PACKAGE_DEFINITIONS> = {
  'node': 'nodejs',
  'git': 'git',
  'gh': 'githubCLI',
  'claude': 'claudeCode',
  'pwsh': 'powershell7',
};

export async function runInstall(): Promise<void> {
  console.log(chalk.cyan('\n📥 Win-Miyabi 依存パッケージインストーラー\n'));

  if (!isNativeWindows()) {
    console.log(chalk.yellow('⚠ このコマンドはWindows専用です。'));
    console.log(chalk.gray('  WSL2環境では各ディストリビューションのパッケージマネージャーを使用してください。'));
    return;
  }

  // パッケージマネージャーの確認
  const managers = detectPackageManagers();
  const availableManagers = managers.filter(m => m.available);

  if (availableManagers.length === 0) {
    console.log(chalk.yellow('⚠ winget / Chocolatey / Scoop が見つかりません。'));
    console.log(chalk.white('\nwinget のインストール方法:'));
    console.log(chalk.gray('  Microsoft Store から「アプリ インストーラー」をインストールしてください'));
    console.log(chalk.gray('  または: https://aka.ms/getwinget'));
  } else {
    console.log(chalk.green(`✓ パッケージマネージャー: ${availableManagers.map(m => m.type).join(', ')}`));
  }

  // 依存関係チェック
  const spinner = ora('依存パッケージを確認中...').start();
  const depsReport = await checkDependencies();
  spinner.stop();

  const missing = getMissingRequired(depsReport);

  if (missing.length === 0) {
    console.log(chalk.green('\n✓ 全ての必須パッケージがインストール済みです！\n'));
    return;
  }

  console.log(chalk.yellow(`\n${missing.length}個のパッケージをインストールします:`));
  for (const dep of missing) {
    console.log(chalk.gray(`  - ${dep.name}`));
  }
  console.log('');

  // 各パッケージをインストール
  let successCount = 0;
  for (const dep of missing) {
    const pkgKey = PACKAGE_MAP[dep.command];
    if (!pkgKey) {
      console.log(chalk.yellow(`⚠ ${dep.name}: 自動インストール非対応`));
      console.log(chalk.gray(`  手動インストール: ${dep.installHint}`));
      continue;
    }

    const pkg = PACKAGE_DEFINITIONS[pkgKey];
    const success = await installPackage(pkg, dep.name);
    if (success) successCount++;
  }

  // 結果サマリー
  console.log(chalk.gray('\n' + '─'.repeat(50)));
  if (successCount === missing.length) {
    console.log(chalk.green(`\n✨ 全て (${successCount}/${missing.length}) のパッケージをインストールしました！`));
    console.log(chalk.white('\n新しいターミナルを開いて設定を反映させてください。'));
    console.log(chalk.gray('  win-miyabi setup で環境変数を設定'));
    console.log(chalk.gray('  win-miyabi check で環境を確認\n'));
  } else {
    console.log(chalk.yellow(`\n${successCount}/${missing.length} パッケージをインストールしました。`));
    console.log(chalk.gray('  失敗したパッケージは手動でインストールしてください。'));
    console.log(chalk.gray('  詳細: win-miyabi check\n'));
  }
}
