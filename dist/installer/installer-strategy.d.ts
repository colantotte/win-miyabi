export type PackageManager = 'winget' | 'chocolatey' | 'scoop' | 'manual';
export interface PackageManagerInfo {
    type: PackageManager;
    available: boolean;
    version: string | null;
    priority: number;
}
export interface InstallPackage {
    winget?: string;
    chocolatey?: string;
    scoop?: string;
    manual?: string;
    npm?: string;
}
/**
 * 利用可能なパッケージマネージャーを検出
 */
export declare function detectPackageManagers(): PackageManagerInfo[];
/**
 * 最優先のパッケージマネージャーを取得
 */
export declare function getBestPackageManager(): PackageManager;
/**
 * パッケージをインストール
 */
export declare function installPackage(pkg: InstallPackage, displayName: string): Promise<boolean>;
/**
 * 依存パッケージの定義
 */
export declare const PACKAGE_DEFINITIONS: Record<string, InstallPackage>;
//# sourceMappingURL=installer-strategy.d.ts.map