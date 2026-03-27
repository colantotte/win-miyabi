/**
 * インストーラー選択ストラテジー
 * winget → Chocolatey → Scoop の優先順位でパッケージマネージャーを選択
 */
import { isCommandAvailable, execCommand } from '../platform/shell-executor.js';
import { isNativeWindows } from '../platform/windows-detector.js';
import chalk from 'chalk';

export type PackageManager = 'winget' | 'chocolatey' | 'scoop' | 'manual';

export interface PackageManagerInfo {
  type: PackageManager;
  available: boolean;
  version: string | null;
  priority: number;
}

export interface InstallPackage {
  winget?: string;
  chocolatey?: string;
  scoop?: string;
  manual?: string; // 手動インストールURL/コマンド
  npm?: string;   // npm install -g
}

/**
 * 利用可能なパッケージマネージャーを検出
 */
export function detectPackageManagers(): PackageManagerInfo[] {
  if (!isNativeWindows()) {
    return [];
  }

  const managers: PackageManagerInfo[] = [
    {
      type: 'winget',
      available: isCommandAvailable('winget'),
      version: null,
      priority: 1,
    },
    {
      type: 'chocolatey',
      available: isCommandAvailable('choco'),
      version: null,
      priority: 2,
    },
    {
      type: 'scoop',
      available: isCommandAvailable('scoop'),
      version: null,
      priority: 3,
    },
  ];

  // バージョン情報を取得
  for (const manager of managers) {
    if (manager.available) {
      const cmd = manager.type === 'winget' ? 'winget --version'
        : manager.type === 'chocolatey' ? 'choco --version'
        : 'scoop --version';
      const result = execCommand(cmd, { silent: true });
      manager.version = result.success ? result.stdout.split('\n')[0] : null;
    }
  }

  return managers.sort((a, b) => a.priority - b.priority);
}

/**
 * 最優先のパッケージマネージャーを取得
 */
export function getBestPackageManager(): PackageManager {
  const managers = detectPackageManagers();
  const available = managers.filter(m => m.available);
  return available[0]?.type ?? 'manual';
}

/**
 * パッケージをインストール
 */
export async function installPackage(pkg: InstallPackage, displayName: string): Promise<boolean> {
  const manager = getBestPackageManager();
  console.log(chalk.cyan(`📦 ${displayName} をインストール中... (${manager})`));

  if (manager === 'winget' && pkg.winget) {
    const result = execCommand(`winget install ${pkg.winget} --accept-package-agreements --accept-source-agreements`);
    if (result.success) {
      console.log(chalk.green(`✓ ${displayName} のインストール完了`));
      return true;
    }
  }

  if (manager === 'chocolatey' && pkg.chocolatey) {
    const result = execCommand(`choco install ${pkg.chocolatey} -y`);
    if (result.success) {
      console.log(chalk.green(`✓ ${displayName} のインストール完了`));
      return true;
    }
  }

  if (manager === 'scoop' && pkg.scoop) {
    const result = execCommand(`scoop install ${pkg.scoop}`);
    if (result.success) {
      console.log(chalk.green(`✓ ${displayName} のインストール完了`));
      return true;
    }
  }

  if (pkg.npm) {
    const result = execCommand(`npm install -g ${pkg.npm}`);
    if (result.success) {
      console.log(chalk.green(`✓ ${displayName} のインストール完了`));
      return true;
    }
  }

  // 手動インストール案内
  if (pkg.manual) {
    console.log(chalk.yellow(`\n⚠ ${displayName} を手動でインストールしてください:`));
    console.log(chalk.white(`  ${pkg.manual}`));
  }

  return false;
}

/**
 * 依存パッケージの定義
 */
export const PACKAGE_DEFINITIONS: Record<string, InstallPackage> = {
  nodejs: {
    winget: 'OpenJS.NodeJS.LTS',
    chocolatey: 'nodejs-lts',
    scoop: 'nodejs-lts',
    manual: 'https://nodejs.org/en/download/',
  },
  git: {
    winget: 'Git.Git',
    chocolatey: 'git',
    scoop: 'git',
    manual: 'https://git-scm.com/download/win',
  },
  githubCLI: {
    winget: 'GitHub.cli',
    chocolatey: 'gh',
    scoop: 'gh',
    manual: 'https://cli.github.com/',
  },
  claudeCode: {
    npm: '@anthropic-ai/claude-code',
    manual: 'npm install -g @anthropic-ai/claude-code',
  },
  powershell7: {
    winget: 'Microsoft.PowerShell',
    chocolatey: 'powershell-core',
    scoop: 'pwsh',
    manual: 'https://github.com/PowerShell/PowerShell/releases',
  },
};
