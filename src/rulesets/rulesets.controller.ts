import { join } from 'path';
import { readdir, stat } from 'fs-extra';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { PREFIX_PATH } from './constants';
import { IRulesetItem } from './rulesets.interface';
import { FileContentGetterDto } from './rulesets.dto';
import { RulesetsService } from './rulesets.service';

@Controller('rulesets')
export class RulesetsController {
  private readonly logger = new Logger(RulesetsController.name);

  constructor(private readonly rulesetsService: RulesetsService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async listFiles() {
    const _directoryPath = join(__dirname, '../assets', PREFIX_PATH);
    try {
      const _res: IRulesetItem[] = [];
      const _fileList = await readdir(_directoryPath);
      for (const file of _fileList) {
        const filePath = join(_directoryPath, file);
        const _stat = await stat(filePath);
        const _p = `${PREFIX_PATH}/${file}`;

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
    return await this.rulesetsService.readContentByFilename(filename);
  }

  @Get('/:filename')
  async getContentByFilename(
    @Param() params: { filename: string },
  ): Promise<string> {
    return await this.rulesetsService.readContentByFilename(params.filename);
  }
}
