import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Query,
} from '@nestjs/common';

import { IRulesetItem } from './rulesets.interface';
import {
  FileContentGetterDto,
  FileListQueryDto,
  FormatFileContent,
} from './rulesets.dto';
import { RULESETS_DIR } from 'src/constants';
import { AssetsService } from 'src/assets/assets.service';

@Controller('rulesets')
export class RulesetsController {
  static MAX_SIZE = 200 * 1024;
  private readonly logger = new Logger(RulesetsController.name);

  constructor(private readonly assetsService: AssetsService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async listFiles(@Query() query: FileListQueryDto): Promise<IRulesetItem[]> {
    const { recursive = false } = query;
    this.logger.log(`list file query: ${JSON.stringify(query)}`);
    try {
      this.logger.log(`list files in ${RULESETS_DIR}`);
      const files = await this.assetsService._readFilesInDir(RULESETS_DIR, {
        recursive,
      });
      return files.map((file) => ({
        name: file.filename,
        path: file.path,
      }));
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(error.stack);
      throw new InternalServerErrorException('Could not read directory');
    }
  }

  @Get('get-content')
  @HttpCode(HttpStatus.OK)
  async getContent(
    @Query() query: FileContentGetterDto,
  ): Promise<FormatFileContent> {
    const { filename } = query;
    const rawContent = await this.assetsService._readByName(
      filename,
      RULESETS_DIR,
    );
    return {
      raw: rawContent,
      filename,
    };
  }
}
