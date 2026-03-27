/**
 * 依存パッケージ確認モジュール
 * Node.js, Git, GitHub CLI, Claude Code の存在とバージョンを確認
 */
import { isCommandAvailable, getCommandVersion } from '../platform/shell-executor.js';

export interface DependencyStatus {
  name: string;
  command: string;
  available: boolean;
  version: string | null;
  required: boolean;
  minVersion?: string;
  installHint: string;
}

export interface DependenciesReport {
  allRequired: boolean;
  allOptional: boolean;
  dependencies: DependencyStatus[];
}

const DEPENDENCIES: Array<Omit<DependencyStatus, 'available' | 'version'>> = [
  {
    name: 'Node.js',
    command: 'node',
    required: true,
    minVersion: '18.0.0',
    installHint: 'winget install OpenJS.NodeJS.LTS',
  },
  {
    name: 'Git',
    command: 'git',
    required: true,
    installHint: 'winget install Git.Git',
  },
  {
    name: 'GitHub CLI (gh)',
    command: 'gh',
    required: true,
    installHint: 'winget install GitHub.cli',
  },
  {
    name: 'Claude Code',
    command: 'claude',
    required: true,
    installHint: 'npm install -g @anthropic-ai/claude-code',
  },
  {
    name: 'PowerShell 7+',
    command: 'pwsh',
    required: false,
    minVersion: '7.0.0',
    installHint: 'winget install Microsoft.PowerShell',
  },
  {
    name: 'Windows Subsystem for Linux (WSL)',
    command: 'wsl',
    required: false,
    installHint: 'wsl --install (管理者PowerShellで実行)',
  },
];

/**
 * バージョン文字列を比較可能な数値配列に変換
 */
function parseVersion(version: string): number[] {
  return version
    .replace(/^[^0-9]*/, '') // 先頭の非数字を除去
    .split('.')
    .map(v => parseInt(v, 10) || 0)
    .slice(0, 3);
}

/**
 * バージョンが最小要件を満たすかチェック
 */
function meetsMinVersion(actual: string | null, minimum: string): boolean {
  if (!actual) return false;
  const actualParts = parseVersion(actual);
  const minParts = parseVersion(minimum);
  for (let i = 0; i < 3; i++) {
    const a = actualParts[i] ?? 0;
    const m = minParts[i] ?? 0;
    if (a > m) return true;
    if (a < m) return false;
  }
  return true;
}

/**
 * 全依存パッケージの状態を確認
 */
export async function checkDependencies(): Promise<DependenciesReport> {
  const dependencies: DependencyStatus[] = DEPENDENCIES.map(dep => {
    const available = isCommandAvailable(dep.command);
    const version = available ? getCommandVersion(dep.command) : null;

    // バージョン要件チェック
    const meetsVersion = dep.minVersion
      ? meetsMinVersion(version, dep.minVersion)
      : true;

    return {
      ...dep,
      available: available && meetsVersion,
      version,
    };
  });

  const required = dependencies.filter(d => d.required);
  const optional = dependencies.filter(d => !d.required);

  return {
    allRequired: required.every(d => d.available),
    allOptional: optional.every(d => d.available),
    dependencies,
  };
}

/**
 * 不足している必須依存パッケージを取得
 */
export function getMissingRequired(report: DependenciesReport): DependencyStatus[] {
  return report.dependencies.filter(d => d.required && !d.available);
}

/**
 * 不足しているオプション依存パッケージを取得
 */
export function getMissingOptional(report: DependenciesReport): DependencyStatus[] {
  return report.dependencies.filter(d => !d.required && !d.available);
}
