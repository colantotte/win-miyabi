/**
 * シェル実行ユーティリティ
 * Windows (PowerShell/cmd) / Unix (bash/sh) を透過的に実行
 */
import { execSync, spawnSync, SpawnSyncOptions } from 'child_process';
import { isNativeWindows } from './windows-detector.js';

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * PowerShellコマンドを実行
 */
export function execPowerShell(command: string, options: { silent?: boolean } = {}): ExecResult {
  const psExecutable = isNativeWindows() ? 'powershell.exe' : 'powershell.exe';
  const args = ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', command];

  const result = spawnSync(psExecutable, args, {
    encoding: 'utf-8',
    stdio: options.silent ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'pipe', 'pipe'],
  });

  return {
    success: result.status === 0,
    stdout: (result.stdout || '').replace(/\r\n/g, '\n').trim(),
    stderr: (result.stderr || '').replace(/\r\n/g, '\n').trim(),
    exitCode: result.status ?? 1,
  };
}

/**
 * コマンドをシェル経由で実行 (クロスプラットフォーム)
 */
export function execCommand(command: string, options: SpawnSyncOptions & { silent?: boolean } = {}): ExecResult {
  const { silent, ...spawnOptions } = options;
  const shellOptions: SpawnSyncOptions = {
    encoding: 'utf-8',
    shell: isNativeWindows() ? 'cmd.exe' : '/bin/sh',
    stdio: silent ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'pipe', 'pipe'],
    ...spawnOptions,
  };

  let result;
  if (isNativeWindows()) {
    result = spawnSync('cmd.exe', ['/c', command], shellOptions);
  } else {
    result = spawnSync('/bin/sh', ['-c', command], shellOptions);
  }

  return {
    success: result.status === 0,
    stdout: (result.stdout as string || '').replace(/\r\n/g, '\n').trim(),
    stderr: (result.stderr as string || '').replace(/\r\n/g, '\n').trim(),
    exitCode: result.status ?? 1,
  };
}

/**
 * コマンドが利用可能かどうかを確認
 */
export function isCommandAvailable(command: string): boolean {
  try {
    if (isNativeWindows()) {
      execSync(`where ${command}`, { stdio: 'ignore', shell: 'cmd.exe' });
    } else {
      execSync(`command -v ${command}`, { stdio: 'ignore', shell: '/bin/sh' });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * コマンドのバージョンを取得
 */
export function getCommandVersion(command: string, versionFlag = '--version'): string | null {
  try {
    const result = execSync(`${command} ${versionFlag}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
      shell: isNativeWindows() ? 'cmd.exe' : '/bin/sh',
    });
    return result.trim().split('\n')[0] || null;
  } catch {
    return null;
  }
}

/**
 * WSL2内でコマンドを実行
 */
export function execInWSL(command: string, options: { cwd?: string } = {}): ExecResult {
  const wslCommand = options.cwd
    ? `wsl -- bash -c "cd '${options.cwd}' && ${command}"`
    : `wsl -- bash -c "${command.replace(/"/g, '\\"')}"`;

  return execCommand(wslCommand, { silent: true });
}

/**
 * 管理者権限が必要なPowerShellコマンドを実行
 * (ユーザーへUAC確認ダイアログが表示される)
 */
export function execAsAdmin(command: string): boolean {
  if (!isNativeWindows()) {
    console.warn('管理者権限実行はWindows専用です');
    return false;
  }

  const result = spawnSync('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command',
    `Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '`"')}"' -Verb RunAs -Wait`,
  ], { encoding: 'utf-8', stdio: 'inherit' });

  return result.status === 0;
}
