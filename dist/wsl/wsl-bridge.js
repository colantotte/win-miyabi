/**
 * WSL2ブリッジモジュール
 * Windows側からWSL2内のmiyabiを実行するブリッジ
 */
import { spawnSync } from 'child_process';
import { windowsPathToWSL } from '../platform/path-utils.js';
import { isNativeWindows } from '../platform/windows-detector.js';
/**
 * WSL2内でmiyabiコマンドを実行
 */
export function runMiyabiInWSL(args, options = {}) {
    if (!isNativeWindows()) {
        console.error('WSLブリッジはWindows専用です');
        return 1;
    }
    const wslArgs = [];
    // ディストリビューション指定
    if (options.distro) {
        wslArgs.push('-d', options.distro);
    }
    // 作業ディレクトリを設定
    const wslCwd = options.cwd ? windowsPathToWSL(options.cwd) : windowsPathToWSL(process.cwd());
    // 環境変数を引き継ぎ
    const envVars = [];
    if (process.env.ANTHROPIC_API_KEY) {
        envVars.push(`ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY}`);
    }
    if (process.env.GITHUB_TOKEN) {
        envVars.push(`GITHUB_TOKEN=${process.env.GITHUB_TOKEN}`);
    }
    if (options.env) {
        for (const [key, value] of Object.entries(options.env)) {
            envVars.push(`${key}=${value}`);
        }
    }
    // コマンドを構築
    const miyabiArgs = args.join(' ');
    const envPrefix = envVars.map(e => `export ${e};`).join(' ');
    const command = `${envPrefix} cd '${wslCwd}' && miyabi ${miyabiArgs}`;
    wslArgs.push('--', 'bash', '-c', command);
    const result = spawnSync('wsl.exe', wslArgs, {
        stdio: 'inherit',
        encoding: 'utf-8',
    });
    return result.status ?? 1;
}
/**
 * WSL2内でコマンドを実行して出力を取得
 */
export function execInWSL(command, options = {}) {
    if (!isNativeWindows()) {
        return { success: false, stdout: '', stderr: 'WSLブリッジはWindows専用です' };
    }
    const wslArgs = [];
    if (options.distro) {
        wslArgs.push('-d', options.distro);
    }
    const wslCwd = options.cwd ? windowsPathToWSL(options.cwd) : windowsPathToWSL(process.cwd());
    const fullCommand = `cd '${wslCwd}' && ${command}`;
    wslArgs.push('--', 'bash', '-c', fullCommand);
    const result = spawnSync('wsl.exe', wslArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
        encoding: 'utf-8',
    });
    return {
        success: result.status === 0,
        stdout: (result.stdout || '').replace(/\r\n/g, '\n').trim(),
        stderr: (result.stderr || '').replace(/\r\n/g, '\n').trim(),
    };
}
/**
 * WSL2内にMiyabiをインストール
 */
export function installMiyabiInWSL(distro) {
    console.log('🔧 WSL2内にMiyabiをインストール中...');
    const commands = [
        'curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -',
        'sudo apt-get install -y nodejs',
        'npm install -g miyabi',
    ];
    for (const cmd of commands) {
        const result = execInWSL(cmd, { distro });
        if (!result.success) {
            console.error(`コマンド失敗: ${cmd}`);
            return false;
        }
    }
    return true;
}
