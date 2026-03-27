/**
 * プラットフォーム検出モジュール
 * Windows / WSL2 / macOS / Linux を判定する
 */
import { execSync } from 'child_process';
import { platform, release } from 'os';

export type PlatformType = 'windows' | 'wsl2' | 'macos' | 'linux' | 'unknown';

export interface PlatformInfo {
  type: PlatformType;
  isWindows: boolean;
  isWSL: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  osRelease: string;
  powershellVersion: string | null;
  windowsTerminal: boolean;
}

/**
 * WSL2環境かどうかを判定
 * 環境変数 WSL_DISTRO_NAME が存在する場合はWSL2
 */
export function isWSL(): boolean {
  return !!(process.env.WSL_DISTRO_NAME || process.env.WSLENV);
}

/**
 * ネイティブWindows環境かどうかを判定
 */
export function isNativeWindows(): boolean {
  return platform() === 'win32';
}

/**
 * macOS環境かどうかを判定
 */
export function isMacOS(): boolean {
  return platform() === 'darwin';
}

/**
 * Linux環境かどうかを判定 (WSL2除く)
 */
export function isLinux(): boolean {
  return platform() === 'linux' && !isWSL();
}

/**
 * プラットフォームタイプを取得
 */
export function getPlatformType(): PlatformType {
  if (isNativeWindows()) return 'windows';
  if (isWSL()) return 'wsl2';
  if (isMacOS()) return 'macos';
  if (platform() === 'linux') return 'linux';
  return 'unknown';
}

/**
 * PowerShellのバージョンを取得 (Windows/WSL2のみ)
 */
export function getPowerShellVersion(): string | null {
  try {
    const psCmd = isNativeWindows()
      ? 'powershell -Command "$PSVersionTable.PSVersion.ToString()"'
      : 'powershell.exe -Command "$PSVersionTable.PSVersion.ToString()" 2>/dev/null';
    const result = execSync(psCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    return result.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Windows Terminal で実行されているかどうかを確認
 */
export function isWindowsTerminal(): boolean {
  return !!(process.env.WT_SESSION || process.env.WT_PROFILE_ID);
}

/**
 * 詳細なプラットフォーム情報を取得
 */
export function getPlatformInfo(): PlatformInfo {
  const type = getPlatformType();
  return {
    type,
    isWindows: type === 'windows',
    isWSL: type === 'wsl2',
    isMacOS: type === 'macos',
    isLinux: type === 'linux',
    osRelease: release(),
    powershellVersion: (type === 'windows' || type === 'wsl2') ? getPowerShellVersion() : null,
    windowsTerminal: isWindowsTerminal(),
  };
}
