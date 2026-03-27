#!/usr/bin/env node
/**
 * Win-Miyabi postinstall スクリプト
 * インストール後のウェルカムメッセージを表示
 */

import { platform } from 'os';

const isWindows = platform() === 'win32';
const isWSL = !!(process.env.WSL_DISTRO_NAME || process.env.WSLENV);

const colors = {
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  gray: (t) => `\x1b[90m${t}\x1b[0m`,
  white: (t) => `\x1b[37m${t}\x1b[0m`,
  bold: (t) => `\x1b[1m${t}\x1b[0m`,
};

console.log('\n' + colors.cyan(colors.bold('🌸 Win-Miyabi インストール完了！')));
console.log(colors.gray('WindowsでMiyabiを使えるようにするブリッジツールです。\n'));

if (isWindows) {
  console.log(colors.green('✓ Windows環境を検出しました\n'));
  console.log(colors.white(colors.bold('次のステップ:')));
  console.log(colors.gray('  1. 環境診断:'));
  console.log(colors.white('     win-miyabi check\n'));
  console.log(colors.gray('  2. 不足パッケージをインストール:'));
  console.log(colors.white('     win-miyabi install\n'));
  console.log(colors.gray('  3. APIキー・GitHubトークンを設定:'));
  console.log(colors.white('     win-miyabi setup\n'));
  console.log(colors.gray('  4. WSL2推奨 (オプション):'));
  console.log(colors.white('     win-miyabi wsl guide\n'));
  console.log(colors.gray('  5. Miyabiを起動:'));
  console.log(colors.white('     win-miyabi run\n'));
} else if (isWSL) {
  console.log(colors.green('✓ WSL2環境を検出しました\n'));
  console.log(colors.white(colors.bold('次のステップ:')));
  console.log(colors.gray('  環境診断: ') + colors.white('win-miyabi check'));
  console.log(colors.gray('  APIキー設定: ') + colors.white('win-miyabi setup'));
  console.log(colors.gray('  Miyabi起動: ') + colors.white('win-miyabi run\n'));
} else {
  console.log(colors.yellow('⚠ このパッケージはWindows/WSL2向けです。'));
  console.log(colors.gray('  macOS/Linuxでは直接 miyabi コマンドをご使用ください。\n'));
}

console.log(colors.cyan('🌸 Win-Miyabi - Beauty in Autonomous Development on Windows\n'));
