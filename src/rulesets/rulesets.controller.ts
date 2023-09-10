import { join } from 'path';
import { readdir, stat, readFile } from 'fs-extra';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Query,
} from '@nestjs/common';
import { IRulesetItem } from './rulesets.interface';
import { FileContentGetterDto } from './rulesets.dto';

@Controller('rulesets')
export class RulesetsController {
  static PREFIX_PATH = 'rulesets';

  private readonly logger = new Logger(RulesetsController.name);

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async listFiles() {
    const _directoryPath = join(
      __dirname,
      '../assets',
      RulesetsController.PREFIX_PATH,
    );
    try {
      const _res: IRulesetItem[] = [];
      const _fileList = await readdir(_directoryPath);
      for (const file of _fileList) {
        const filePath = join(_directoryPath, file);
        const _stat = await stat(filePath);
        const _p = `${RulesetsController.PREFIX_PATH}/${file}`;

        _res.push({
          name: file,
          p: _p,
          d: _stat.isDirectory(),
          can_preview: !_stat.isDirectory() && _stat.size <= 200 * 1024,
        });
      }
      return _res;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
      throw new InternalServerErrorException('Could not read directory');
    }
  }

  @Get('get-content')
  @HttpCode(HttpStatus.OK)
  async getContent(@Query() query: FileContentGetterDto): Promise<string> {
    const { filename } = query;
    const filePath = join(
      __dirname,
      '../assets',
      RulesetsController.PREFIX_PATH,
      filename,
    ); // 你可能需要根据你的项目结构调整这里
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
