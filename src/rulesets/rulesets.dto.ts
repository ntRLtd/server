import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class FileContentGetterDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}

export class FileListQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  recursive?: boolean;
}

export class FormatFileContent {
  @IsNotEmpty()
  @IsString()
  raw: string;

  @IsNotEmpty()
  @IsString()
  filename: string;
}
