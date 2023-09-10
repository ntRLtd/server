import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile, stat } from 'fs-extra';
import { join } from 'path';

import { PREFIX_PATH } from './constants';

@Injectable()
export class RulesetsService {
  async readContentByFilename(filename: string) {
    const filePath = join(__dirname, '../assets', PREFIX_PATH, filename);
    const _stat = await stat(filePath);

    if (_stat.isDirectory()) {
      throw new BadRequestException('Path is a directory');
    }

    if (_stat.size > 200 * 1024) {
      // 200KB
      throw new BadRequestException('File is larger than 200KB');
    }

    return await readFile(filePath, 'utf-8');
  }
}
