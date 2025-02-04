import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateAuthorDTO {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
