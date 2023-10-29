import { IsNotEmpty, IsString } from 'class-validator';

export class FileItem {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}
