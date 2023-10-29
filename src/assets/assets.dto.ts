import { IsNotEmpty, IsString } from 'class-validator';

export class DirItem {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}
