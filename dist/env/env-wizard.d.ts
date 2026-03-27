export interface EnvCheckResult {
    name: string;
    envVar: string;
    currentValue: string | null;
    isSet: boolean;
    isValid: boolean;
}
/**
 * 環境変数の現在の状態を確認
 */
export declare function checkEnvVars(): EnvCheckResult[];
/**
 * 環境変数セットアップウィザードを実行
 */
export declare function runEnvWizard(): Promise<void>;
