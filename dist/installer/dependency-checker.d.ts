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
/**
 * 全依存パッケージの状態を確認
 */
export declare function checkDependencies(): Promise<DependenciesReport>;
/**
 * 不足している必須依存パッケージを取得
 */
export declare function getMissingRequired(report: DependenciesReport): DependencyStatus[];
/**
 * 不足しているオプション依存パッケージを取得
 */
export declare function getMissingOptional(report: DependenciesReport): DependencyStatus[];
