/**
 * WSL2検出・管理モジュール
 */
import { execCommand } from '../platform/shell-executor.js';
import { isNativeWindows } from '../platform/windows-detector.js';
/**
 * WSLのインストール状況と利用可能なディストリビューションを確認
 */
export function getWSLStatus() {
    if (!isNativeWindows()) {
        return {
            installed: false,
            version: null,
            distros: [],
            defaultDistro: null,
            hasUbuntu: false,
        };
    }
    // WSLコマンドの確認
    const versionResult = execCommand('wsl --version', { silent: true });
    if (!versionResult.success) {
        return {
            installed: false,
            version: null,
            distros: [],
            defaultDistro: null,
            hasUbuntu: false,
        };
    }
    // バージョン情報を解析
    const versionMatch = versionResult.stdout.match(/WSL バージョン:\s*([\d.]+)|WSL version:\s*([\d.]+)/);
    const version = versionMatch ? (versionMatch[1] || versionMatch[2]) : null;
    // ディストリビューション一覧を取得
    const listResult = execCommand('wsl --list --verbose', { silent: true });
    const distros = [];
    let defaultDistro = null;
    if (listResult.success) {
        const lines = listResult.stdout.split('\n').slice(1); // ヘッダーをスキップ
        for (const line of lines) {
            const trimmed = line.replace(/\*/g, '').trim();
            if (!trimmed)
                continue;
            const isDefault = line.includes('*');
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 3) {
                const name = parts[0];
                const state = parts[1];
                const wslVersion = parseInt(parts[2], 10);
                distros.push({
                    name,
                    state: ['Running', 'Stopped'].includes(state) ? state : 'Unknown',
                    version: isNaN(wslVersion) ? 0 : wslVersion,
                    isDefault,
                });
                if (isDefault) {
                    defaultDistro = name;
                }
            }
        }
    }
    return {
        installed: true,
        version,
        distros,
        defaultDistro,
        hasUbuntu: distros.some(d => d.name.toLowerCase().includes('ubuntu')),
    };
}
/**
 * WSL2が利用可能かどうかを確認
 */
export function isWSL2Available() {
    const status = getWSLStatus();
    return status.installed && status.distros.some(d => d.version === 2);
}
/**
 * WSL2内にMiyabiがインストールされているかを確認
 */
export function isMiyabiInstalledInWSL(distro) {
    if (!isNativeWindows())
        return false;
    const cmd = distro
        ? `wsl -d ${distro} -- which miyabi`
        : 'wsl -- which miyabi';
    const result = execCommand(cmd, { silent: true });
    return result.success && result.stdout.trim().length > 0;
}
//# sourceMappingURL=wsl-detector.js.map