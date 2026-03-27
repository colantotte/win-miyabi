export interface WSLBridgeOptions {
    distro?: string;
    cwd?: string;
    env?: Record<string, string>;
}
/**
 * WSL2内でmiyabiコマンドを実行
 */
export declare function runMiyabiInWSL(args: string[], options?: WSLBridgeOptions): number;
/**
 * WSL2内でコマンドを実行して出力を取得
 */
export declare function execInWSL(command: string, options?: WSLBridgeOptions): {
    success: boolean;
    stdout: string;
    stderr: string;
};
/**
 * WSL2内にMiyabiをインストール
 */
export declare function installMiyabiInWSL(distro?: string): boolean;
