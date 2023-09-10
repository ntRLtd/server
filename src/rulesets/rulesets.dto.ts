import { IsNotEmpty, IsString } from 'class-validator';

export class FileContentGetterDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
