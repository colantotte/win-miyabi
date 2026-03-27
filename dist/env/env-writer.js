/**
 * 環境変数永続化モジュール
 * Windows: setx コマンド + PowerShellプロファイル
 * Unix: ~/.bashrc / ~/.zshrc への追記
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { isNativeWindows } from '../platform/windows-detector.js';
import { execPowerShell } from '../platform/shell-executor.js';
import { getHomeDir } from '../platform/path-utils.js';
const SETX_MAX_LENGTH = 1024; // setx の文字数制限
/**
 * 環境変数をWindowsに永続保存
 * 1. setx で User環境変数に設定 (次のセッションから有効)
 * 2. PowerShellプロファイルに追記 (即時有効化用)
 */
export function setWindowsEnvVar(name, value) {
    if (!isNativeWindows()) {
        console.warn('setWindowsEnvVar はWindows専用です');
        return false;
    }
    let success = false;
    // setxで永続保存 (1024文字以内の場合)
    if (value.length <= SETX_MAX_LENGTH) {
        try {
            execSync(`setx ${name} "${value.replace(/"/g, '\\"')}"`, {
                stdio: 'ignore',
                shell: 'cmd.exe',
            });
            success = true;
        }
        catch {
            // setxが失敗した場合はPowerShellプロファイルにフォールバック
        }
    }
    // PowerShellプロファイルにも追記 (即時有効化 + setx失敗時のフォールバック)
    const profilePatched = patchPowerShellProfile(name, value);
    success = success || profilePatched;
    // 現在のプロセスの環境変数も更新
    process.env[name] = value;
    return success;
}
/**
 * PowerShellプロファイルに環境変数を追記
 */
export function patchPowerShellProfile(name, value) {
    try {
        // PowerShellプロファイルのパスを取得
        const result = execPowerShell('$PROFILE');
        if (!result.success || !result.stdout) {
            return false;
        }
        const profilePath = result.stdout.trim();
        const profileDir = path.dirname(profilePath);
        // ディレクトリが存在しない場合は作成
        if (!fs.existsSync(profileDir)) {
            fs.mkdirSync(profileDir, { recursive: true });
        }
        // プロファイルが存在しない場合は作成
        if (!fs.existsSync(profilePath)) {
            fs.writeFileSync(profilePath, '# Win-Miyabi generated profile\n', 'utf-8');
        }
        const profileContent = fs.readFileSync(profilePath, 'utf-8');
        const envLine = `$env:${name} = "${value.replace(/"/g, '`"')}"`;
        // 既に設定されている場合はスキップ
        if (profileContent.includes(`$env:${name} =`)) {
            // 既存の行を更新
            const updated = profileContent.replace(new RegExp(`\\$env:${name} = ".*"`, 'g'), envLine);
            fs.writeFileSync(profilePath, updated, 'utf-8');
        }
        else {
            // 新規追記
            fs.appendFileSync(profilePath, `\n# Win-Miyabi: ${name}\n${envLine}\n`, 'utf-8');
        }
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Unix系OSのシェルプロファイルに環境変数を追記
 */
export function patchUnixProfile(name, value) {
    const shell = process.env.SHELL || '/bin/bash';
    const homeDir = getHomeDir();
    let profilePath;
    if (shell.includes('zsh')) {
        profilePath = path.join(homeDir, '.zshrc');
    }
    else if (shell.includes('fish')) {
        profilePath = path.join(homeDir, '.config', 'fish', 'config.fish');
    }
    else {
        profilePath = path.join(homeDir, '.bashrc');
    }
    try {
        if (!fs.existsSync(profilePath)) {
            fs.writeFileSync(profilePath, '', 'utf-8');
        }
        const profileContent = fs.readFileSync(profilePath, 'utf-8');
        const exportLine = `export ${name}="${value}"`;
        if (profileContent.includes(`export ${name}=`)) {
            // 既存の行を更新
            const updated = profileContent.replace(new RegExp(`export ${name}=.*`, 'g'), exportLine);
            fs.writeFileSync(profilePath, updated, 'utf-8');
        }
        else {
            fs.appendFileSync(profilePath, `\n# Win-Miyabi: ${name}\n${exportLine}\n`, 'utf-8');
        }
        // 現在のプロセスの環境変数も更新
        process.env[name] = value;
        return true;
    }
    catch {
        return false;
    }
}
/**
 * プラットフォームに応じて環境変数を永続保存
 */
export function persistEnvVar(name, value) {
    if (isNativeWindows()) {
        const success = setWindowsEnvVar(name, value);
        const psResult = execPowerShell('$PROFILE');
        return { success, profilePath: psResult.stdout || 'PowerShellプロファイル' };
    }
    else {
        const shell = process.env.SHELL || '/bin/bash';
        const homeDir = getHomeDir();
        const profileName = shell.includes('zsh') ? '.zshrc'
            : shell.includes('fish') ? '.config/fish/config.fish'
                : '.bashrc';
        const profilePath = path.join(homeDir, profileName);
        const success = patchUnixProfile(name, value);
        return { success, profilePath };
    }
}
//# sourceMappingURL=env-writer.js.map