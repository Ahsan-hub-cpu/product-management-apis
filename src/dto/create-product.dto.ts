import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsValidName } from '../validators/valid-name.decorator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsValidName()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
