/**
 * シェル実行ユーティリティ
 * Windows (PowerShell/cmd) / Unix (bash/sh) を透過的に実行
 */
import { SpawnSyncOptions } from 'child_process';
export interface ExecResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number;
}
/**
 * PowerShellコマンドを実行
 */
export declare function execPowerShell(command: string, options?: {
    silent?: boolean;
}): ExecResult;
/**
 * コマンドをシェル経由で実行 (クロスプラットフォーム)
 */
export declare function execCommand(command: string, options?: SpawnSyncOptions & {
    silent?: boolean;
}): ExecResult;
/**
 * コマンドが利用可能かどうかを確認
 */
export declare function isCommandAvailable(command: string): boolean;
/**
 * コマンドのバージョンを取得
 */
export declare function getCommandVersion(command: string, versionFlag?: string): string | null;
/**
 * WSL2内でコマンドを実行
 */
export declare function execInWSL(command: string, options?: {
    cwd?: string;
}): ExecResult;
/**
 * 管理者権限が必要なPowerShellコマンドを実行
 * (ユーザーへUAC確認ダイアログが表示される)
 */
export declare function execAsAdmin(command: string): boolean;
//# sourceMappingURL=shell-executor.d.ts.map