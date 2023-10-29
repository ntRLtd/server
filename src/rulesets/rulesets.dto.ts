import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class FileContentGetterDto {
  @IsNotEmpty()
  @IsString()
  filepath: string;
}

export class FileListQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  recursive?: boolean;

  @IsOptional()
  @IsString()
  subDir?: string;
}

export class FormatFileContent {
  @IsNotEmpty()
  @IsString()
  raw: string;

  @IsNotEmpty()
  @IsString()
  filepath: string;
}

export class FileTreeQueryDto {
  @IsOptional()
  @IsString()
  subDir?: string;
}

export class FileTreeItem {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsBoolean()
  isDir: boolean;
}

export class UpdateContentDto {
  @IsNotEmpty()
  @IsString()
  filepath: string;

  @IsNotEmpty()
  @IsString()
  updateContent: string;
}
