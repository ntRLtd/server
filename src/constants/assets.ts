import { join, resolve } from 'path';

export const ASSETS_PATH = join(process.cwd(), 'assets');
export const RULESETS_DIR = 'rulesets';
export const RULESETS_PATH = resolve(ASSETS_PATH, RULESETS_DIR);
