import { IsString, IsOptional, IsDecimal, IsNumber } from 'class-validator';
import { IsValidName } from '../validators/valid-name.decorator'

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @IsValidName()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;
}
