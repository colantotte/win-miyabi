/**
 * WindowsパスをWSL2パスに変換
 * 例: C:\Users\foo → /mnt/c/Users/foo
 */
export declare function windowsPathToWSL(winPath: string): string;
/**
 * WSL2パスをWindowsパスに変換
 * 例: /mnt/c/Users/foo → C:\Users\foo
 */
export declare function wslPathToWindows(wslPath: string): string;
/**
 * 現在のプラットフォームに適したパス区切り文字を使用
 */
export declare function platformPath(...parts: string[]): string;
/**
 * パスを表示用に正規化 (バックスラッシュをスラッシュに)
 */
export declare function normalizeForDisplay(p: string): string;
/**
 * スペースを含むパスを適切にクォート
 */
export declare function quotePath(p: string): string;
/**
 * ホームディレクトリのパスを取得
 */
export declare function getHomeDir(): string;
/**
 * カレントディレクトリをWSLパスに変換 (WSL2環境から呼び出す場合)
 */
export declare function getCurrentDirForWSL(): string;
