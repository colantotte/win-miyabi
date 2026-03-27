/**
 * パスユーティリティ
 * Windows / WSL2 間のパス変換、および安全なパス処理
 */
import { execSync } from 'child_process';
import { isNativeWindows, isWSL } from './windows-detector.js';
import path from 'path';

/**
 * WindowsパスをWSL2パスに変換
 * 例: C:\Users\foo → /mnt/c/Users/foo
 */
export function windowsPathToWSL(winPath: string): string {
  // wslpathコマンドが使える場合はそれを利用
  if (isWSL()) {
    try {
      const result = execSync(`wslpath -u "${winPath.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return result.trim();
    } catch {
      // フォールバック: 手動変換
    }
  }

  // 手動変換
  const normalized = winPath.replace(/\\/g, '/');
  const match = normalized.match(/^([A-Za-z]):(.*)/);
  if (match) {
    const driveLetter = match[1].toLowerCase();
    const rest = match[2];
    return `/mnt/${driveLetter}${rest}`;
  }
  return normalized;
}

/**
 * WSL2パスをWindowsパスに変換
 * 例: /mnt/c/Users/foo → C:\Users\foo
 */
export function wslPathToWindows(wslPath: string): string {
  if (isWSL()) {
    try {
      const result = execSync(`wslpath -w "${wslPath.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return result.trim();
    } catch {
      // フォールバック
    }
  }

  // 手動変換
  const match = wslPath.match(/^\/mnt\/([a-z])(.*)/);
  if (match) {
    const driveLetter = match[1].toUpperCase();
    const rest = match[2].replace(/\//g, '\\');
    return `${driveLetter}:${rest}`;
  }
  return wslPath;
}

/**
 * 現在のプラットフォームに適したパス区切り文字を使用
 */
export function platformPath(...parts: string[]): string {
  return isNativeWindows() ? path.win32.join(...parts) : path.posix.join(...parts);
}

/**
 * パスを表示用に正規化 (バックスラッシュをスラッシュに)
 */
export function normalizeForDisplay(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * スペースを含むパスを適切にクォート
 */
export function quotePath(p: string): string {
  if (p.includes(' ')) {
    return `"${p}"`;
  }
  return p;
}

/**
 * ホームディレクトリのパスを取得
 */
export function getHomeDir(): string {
  if (isNativeWindows()) {
    return process.env.USERPROFILE || process.env.HOMEDRIVE! + process.env.HOMEPATH! || 'C:\\Users\\User';
  }
  return process.env.HOME || '/root';
}

/**
 * カレントディレクトリをWSLパスに変換 (WSL2環境から呼び出す場合)
 */
export function getCurrentDirForWSL(): string {
  const cwd = process.cwd();
  if (isNativeWindows()) {
    return windowsPathToWSL(cwd);
  }
  return cwd;
}
