import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAuthorDTO, UpdateAuthorDTO } from 'src/routes/authors/Author.dto';
import { typeCover } from 'types';

export class CreateBookDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: CreateAuthorDTO;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  cover?: typeCover;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class UpdateBookDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  author?: UpdateAuthorDTO;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  cover?: typeCover;

  @IsNumber()
  @IsOptional()
  price?: number;
}
