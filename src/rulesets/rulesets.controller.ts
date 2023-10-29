import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Put,
  Query,
} from '@nestjs/common';

import {
  FileContentGetterDto,
  FileListQueryDto,
  FileTreeItem,
  FileTreeQueryDto,
  FormatFileContent,
  UpdateContentDto,
} from './rulesets.dto';
import { RULESETS_DIR } from 'src/constants';
import { AssetsService } from 'src/assets/assets.service';
import { join } from 'path';
import { RulesetsService } from './rulesets.service';

@Controller('rulesets')
export class RulesetsController {
  static MAX_SIZE = 200 * 1024;
  private readonly logger = new Logger(RulesetsController.name);

  constructor(
    private readonly rulesetsService: RulesetsService,
    private readonly assetsService: AssetsService,
  ) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async listFiles(@Query() query: FileListQueryDto): Promise<FileTreeItem[]> {
    const { recursive = false, subDir = './' } = query;
    this.logger.log(`list file query: ${JSON.stringify(query)}`);
    try {
      this.logger.log(`list files in ${RULESETS_DIR}`);
      const files = await this.assetsService._readFilesInDir(
        join(RULESETS_DIR, subDir),
        { recursive },
      );
      return files.map((item) => {
        return this.rulesetsService.retrievePath({
          ...item,
          isDir: false,
        });
      });
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
    const { filepath } = query;
    const rawContent = await this.assetsService._readByName(
      filepath,
      RULESETS_DIR,
    );
    return {
      raw: rawContent,
      filepath,
    };
  }

  @Get('file-tree')
  @HttpCode(HttpStatus.OK)
  async getFileTree(@Query() query: FileTreeQueryDto): Promise<FileTreeItem[]> {
    const { subDir = './' } = query;
    const currPath = join(RULESETS_DIR, subDir);
    const files = await this.assetsService._readFilesInDir(currPath);
    const dirs = await this.assetsService._readDirInPath(currPath);

    const fileList = files.map((file) => ({ ...file, isDir: false }));
    const dirList = dirs.map((dir) => ({ ...dir, isDir: true }));

    return dirList.concat(fileList).map(this.rulesetsService.retrievePath);
  }

  @Put('save')
  @HttpCode(HttpStatus.OK)
  async updateFile(@Body() body: UpdateContentDto) {
    const { filepath, updateContent } = body;
    const succeed = await this.assetsService._overwriteFile(
      filepath,
      updateContent,
      RULESETS_DIR,
    );
    return succeed;
  }
}
