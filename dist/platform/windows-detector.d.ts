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
export declare function isWSL(): boolean;
/**
 * ネイティブWindows環境かどうかを判定
 */
export declare function isNativeWindows(): boolean;
/**
 * macOS環境かどうかを判定
 */
export declare function isMacOS(): boolean;
/**
 * Linux環境かどうかを判定 (WSL2除く)
 */
export declare function isLinux(): boolean;
/**
 * プラットフォームタイプを取得
 */
export declare function getPlatformType(): PlatformType;
/**
 * PowerShellのバージョンを取得 (Windows/WSL2のみ)
 */
export declare function getPowerShellVersion(): string | null;
/**
 * Windows Terminal で実行されているかどうかを確認
 */
export declare function isWindowsTerminal(): boolean;
/**
 * 詳細なプラットフォーム情報を取得
 */
export declare function getPlatformInfo(): PlatformInfo;
