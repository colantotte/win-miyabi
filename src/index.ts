#!/usr/bin/env node
/**
 * Win-Miyabi CLI エントリーポイント
 * Miyabi for Windows - WindowsでMiyabiを使えるようにするブリッジツール
 */
import { createProgram } from './cli/program.js';

const program = createProgram();
program.parse(process.argv);
