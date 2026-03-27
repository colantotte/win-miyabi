export interface WSLDistro {
    name: string;
    state: 'Running' | 'Stopped' | 'Unknown';
    version: number;
    isDefault: boolean;
}
export interface WSLStatus {
    installed: boolean;
    version: string | null;
    distros: WSLDistro[];
    defaultDistro: string | null;
    hasUbuntu: boolean;
}
/**
 * WSLのインストール状況と利用可能なディストリビューションを確認
 */
export declare function getWSLStatus(): WSLStatus;
/**
 * WSL2が利用可能かどうかを確認
 */
export declare function isWSL2Available(): boolean;
/**
 * WSL2内にMiyabiがインストールされているかを確認
 */
export declare function isMiyabiInstalledInWSL(distro?: string): boolean;
