import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  exists,
  readFile,
  readdir,
  writeFile,
  stat,
  access,
  constants,
} from 'fs-extra';
import { join } from 'path';
import { ASSETS_PATH } from 'src/constants';
import { FileItem } from './assets.dto';

@Injectable()
export class AssetsService {
  private maxSize = 200 * 1024;
  private readonly logger = new Logger(AssetsService.name);

  set MaxSize(size: number) {
    this.maxSize = size;
  }

  async _readByName(filename: string, subDir?: string) {
    const filePath = join(ASSETS_PATH, subDir ? subDir : './', filename);
    this.logger.log(`read file from ${filePath}`);
    const _exist = await exists(filePath);
    if (!_exist) throw new BadRequestException('File not found');

    const _stat = await stat(filePath);

    if (_stat.isDirectory()) {
      throw new BadRequestException('Path is a directory');
    }

    if (_stat.size > this.maxSize) {
      // 200KB
      throw new BadRequestException('File is larger than 200KB');
    }

    return await readFile(filePath, 'utf-8');
  }

  async _readFilesInDir(
    root: string,
    opt?: {
      recursive?: boolean;
    },
  ): Promise<FileItem[]> {
    const { recursive = false } = opt || {};
    const _dirPath = join(ASSETS_PATH, root);
    this.logger.log(`dir dir: ${_dirPath}`);

    const _stat = await stat(_dirPath);
    if (!_stat.isDirectory()) {
      throw new BadRequestException('Path is not a directory');
    }

    const subDir: string[] = [];
    const subFiles: FileItem[] = [];
    const content = await readdir(_dirPath);
    for (const item of content) {
      const _path = join(_dirPath, item);
      this.logger.log(`read item: ${_path}`);
      const itemStat = await stat(_path);
      if (itemStat.isDirectory()) {
        this.logger.log(`item is dir: ${_path}`);
        const relativePName = join(root, item);
        subDir.push(relativePName);
      } else {
        subFiles.push({
          name: item,
          path: _path.replace(ASSETS_PATH, ''),
        });
      }
    }

    if (subDir.length > 0 && recursive) {
      for (const item of subDir) {
        this.logger.log(`read sub dir: ${item}`);
        const subContent = await this._readFilesInDir(item, opt);
        subFiles.push(...subContent);
      }
    }

    return subFiles;
  }

  async _readDirInPath(root: string) {
    const dirPaths: FileItem[] = [];
    const _dirPath = join(ASSETS_PATH, root);
    const _stat = await stat(_dirPath);
    if (!_stat.isDirectory()) {
      throw new BadRequestException('Path is not a directory');
    }

    const content = await readdir(_dirPath);
    for (const item of content) {
      const _path = join(_dirPath, item);
      const itemStat = await stat(_path);
      if (itemStat.isDirectory()) {
        dirPaths.push({
          name: item,
          path: join(root, item),
        });
      }
    }
    return dirPaths;
  }

  async _overwriteFile(filepath: string, content: string, subDir?: string) {
    const filePath = join(ASSETS_PATH, subDir || './', filepath);
    this.logger.log(`write file to ${filePath}`);
    const _exist = await exists(filePath);
    if (!_exist) throw new BadRequestException('File already exists');

    try {
      await access(filePath, constants.W_OK);
      await writeFile(filePath, content, {
        encoding: 'utf8',
      });
      return true;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
      throw new BadRequestException(
        'Could not write file, or have no permission to write',
      );
    }
  }
}
