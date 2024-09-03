import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptions } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<{ success: boolean; data: Product }> {
    try {
      const product = this.productRepository.create(createProductDto);
      const savedProduct = await this.productRepository.save(product);
      return { success: true, data: savedProduct };
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ success: boolean; data: Product[]; total: number }> {
    try {
      const [products, total] = await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { success: true, data: products, total };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve products');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<{ success: boolean; data: Product }> {
    try {
      const product = await this.findOne(id); 
      await this.productRepository.update(id, updateProductDto);
      const updatedProduct = await this.productRepository.findOne({ where: { id } });
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found after update`);
      }
      return { success: true, data: updatedProduct };
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return { success: true, message: `Product with ID ${id} successfully removed` };
    } catch (error) {
      throw new BadRequestException('Failed to remove product');
    }
  }

  async search(keyword: string): Promise<{ success: boolean; data: Product[]; error?: string }> {
    try {
      const products = await this.productRepository.createQueryBuilder('product')
        .where('product.name ILIKE :keyword OR product.description ILIKE :keyword', { keyword: `%${keyword}%` })
        .getMany();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, data: [], error: 'An error occurred while searching for products' };
    }
  }
}
