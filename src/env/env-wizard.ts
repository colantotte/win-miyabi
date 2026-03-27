/**
 * 環境変数セットアップウィザード
 * ANTHROPIC_API_KEY, GITHUB_TOKEN の対話型設定
 */
import inquirer from 'inquirer';
import chalk from 'chalk';
import { persistEnvVar } from './env-writer.js';

export interface EnvConfig {
  anthropicApiKey: string;
  githubToken: string;
}

interface EnvCheckResult {
  name: string;
  envVar: string;
  currentValue: string | null;
  isSet: boolean;
  isValid: boolean;
}

/**
 * 環境変数の現在の状態を確認
 */
export function checkEnvVars(): EnvCheckResult[] {
  const vars = [
    { name: 'Anthropic API Key', envVar: 'ANTHROPIC_API_KEY', prefix: 'sk-ant-' },
    { name: 'GitHub Token', envVar: 'GITHUB_TOKEN', prefix: 'ghp_' },
  ];

  return vars.map(v => {
    const currentValue = process.env[v.envVar] || null;
    const isSet = !!currentValue;
    const isValid = isSet && currentValue!.startsWith(v.prefix);
    return {
      name: v.name,
      envVar: v.envVar,
      currentValue: isSet ? `${currentValue!.slice(0, 10)}...` : null,
      isSet,
      isValid,
    };
  });
}

/**
 * APIキーの形式を検証
 */
function validateAnthropicKey(key: string): boolean | string {
  if (!key) return 'APIキーを入力してください';
  if (!key.startsWith('sk-ant-')) return 'Anthropic APIキーは sk-ant- で始まる必要があります';
  if (key.length < 40) return 'APIキーが短すぎます';
  return true;
}

/**
 * GitHubトークンの形式を検証
 */
function validateGitHubToken(token: string): boolean | string {
  if (!token) return 'GitHubトークンを入力してください';
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    return 'GitHubトークンは ghp_ または github_pat_ で始まる必要があります';
  }
  if (token.length < 20) return 'トークンが短すぎます';
  return true;
}

/**
 * 環境変数セットアップウィザードを実行
 */
export async function runEnvWizard(): Promise<void> {
  console.log(chalk.cyan('\n🔑 環境変数セットアップウィザード\n'));

  const currentStatus = checkEnvVars();

  // 現在の状態を表示
  console.log(chalk.white('現在の設定状況:'));
  for (const status of currentStatus) {
    if (status.isValid) {
      console.log(chalk.green(`  ✓ ${status.envVar}: ${status.currentValue} (設定済み)`));
    } else if (status.isSet) {
      console.log(chalk.yellow(`  ⚠ ${status.envVar}: ${status.currentValue} (形式が不正)`));
    } else {
      console.log(chalk.red(`  ✗ ${status.envVar}: 未設定`));
    }
  }
  console.log('');

  // 設定が必要な変数を確認
  const needsSetup = currentStatus.filter(s => !s.isValid);
  if (needsSetup.length === 0) {
    console.log(chalk.green('✓ 全ての環境変数が正しく設定されています！'));
    return;
  }

  // Anthropic API Key の設定
  const anthropicStatus = currentStatus.find(s => s.envVar === 'ANTHROPIC_API_KEY');
  let anthropicApiKey = '';

  if (!anthropicStatus?.isValid) {
    console.log(chalk.yellow('📌 Anthropic APIキーの取得方法:'));
    console.log(chalk.gray('   1. https://console.anthropic.com にアクセス'));
    console.log(chalk.gray('   2. Settings → API Keys → Create Key\n'));

    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Anthropic APIキー (sk-ant-...):',
        validate: validateAnthropicKey,
      },
    ]);
    anthropicApiKey = apiKey as string;
  }

  // GitHub Token の設定
  const githubStatus = currentStatus.find(s => s.envVar === 'GITHUB_TOKEN');
  let githubToken = '';

  if (!githubStatus?.isValid) {
    console.log(chalk.yellow('\n📌 GitHubトークンの取得方法:'));
    console.log(chalk.gray('   1. https://github.com/settings/tokens にアクセス'));
    console.log(chalk.gray('   2. Generate new token → repo, workflow スコープを選択\n'));

    const { token } = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'GitHubトークン (ghp_...):',
        validate: validateGitHubToken,
      },
    ]);
    githubToken = token as string;
  }

  // 保存
  console.log(chalk.cyan('\n💾 環境変数を保存しています...\n'));

  if (anthropicApiKey) {
    const result = persistEnvVar('ANTHROPIC_API_KEY', anthropicApiKey);
    if (result.success) {
      console.log(chalk.green(`✓ ANTHROPIC_API_KEY を保存しました`));
      console.log(chalk.gray(`  保存先: ${result.profilePath}`));
    } else {
      console.log(chalk.red('✗ ANTHROPIC_API_KEY の保存に失敗しました'));
    }
  }

  if (githubToken) {
    const result = persistEnvVar('GITHUB_TOKEN', githubToken);
    if (result.success) {
      console.log(chalk.green(`✓ GITHUB_TOKEN を保存しました`));
      console.log(chalk.gray(`  保存先: ${result.profilePath}`));
    } else {
      console.log(chalk.red('✗ GITHUB_TOKEN の保存に失敗しました'));
    }
  }

  console.log(chalk.cyan('\n✨ セットアップ完了！'));
  console.log(chalk.gray('新しいターミナルを開くと設定が有効になります。'));
  console.log(chalk.white('\n次のステップ:'));
  console.log(chalk.gray('  win-miyabi check  - 環境を再確認'));
  console.log(chalk.gray('  win-miyabi run    - Miyabiを起動\n'));
}
