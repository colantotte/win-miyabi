/**
 * 環境変数をWindowsに永続保存
 * 1. setx で User環境変数に設定 (次のセッションから有効)
 * 2. PowerShellプロファイルに追記 (即時有効化用)
 */
export declare function setWindowsEnvVar(name: string, value: string): boolean;
/**
 * PowerShellプロファイルに環境変数を追記
 */
export declare function patchPowerShellProfile(name: string, value: string): boolean;
/**
 * Unix系OSのシェルプロファイルに環境変数を追記
 */
export declare function patchUnixProfile(name: string, value: string): boolean;
/**
 * プラットフォームに応じて環境変数を永続保存
 */
export declare function persistEnvVar(name: string, value: string): {
    success: boolean;
    profilePath: string;
};
//# sourceMappingURL=env-writer.d.ts.map