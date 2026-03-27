export interface RunOptions {
    useWSL?: boolean;
    native?: boolean;
    distro?: string;
}
/**
 * miyabi を実行 (プラットフォームに応じて自動選択)
 */
export declare function runMiyabi(args: string[], options?: RunOptions): Promise<void>;
