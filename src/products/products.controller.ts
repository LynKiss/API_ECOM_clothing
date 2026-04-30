import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Public,
  RequirePermissions,
  ResponseMessage,
} from '../decorator/customize';
import { CreateColorDto } from './dto/create-color.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-product-variant.dto';
import { ProductsService } from './products.service';

type UploadedImageFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ResponseMessage('Get products list')
  getProducts(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('colors')
  @ResponseMessage('Get product colors')
  getColors() {
    return this.productsService.findColors();
  }

  @Post('colors')
  @RequirePermissions('manage_products')
  @ResponseMessage('Create product color')
  createColor(@Body() dto: CreateColorDto) {
    return this.productsService.createColor(dto);
  }

  @Public()
  @Get('sizes')
  @ResponseMessage('Get product sizes')
  getSizes() {
    return this.productsService.findSizes();
  }

  @Post('sizes')
  @RequirePermissions('manage_products')
  @ResponseMessage('Create product size')
  createSize(@Body() dto: CreateSizeDto) {
    return this.productsService.createSize(dto);
  }
  @Public()
  @Get(':id')
  @ResponseMessage('Get product detail')
  getProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @RequirePermissions('manage_products')
  @ResponseMessage('Create product')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @RequirePermissions('manage_products')
  @ResponseMessage('Update product')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Public()
  @Get(':id/variants')
  @ResponseMessage('Get product variants')
  getProductVariants(@Param('id') id: string) {
    return this.productsService.findProductVariants(id);
  }

  @Post(':id/variants')
  @RequirePermissions('manage_products')
  @ResponseMessage('Create product variant')
  createProductVariant(
    @Param('id') id: string,
    @Body() dto: UpsertProductVariantDto,
  ) {
    return this.productsService.createVariant(id, dto);
  }

  @Patch(':id/variants/:variantId')
  @RequirePermissions('manage_products')
  @ResponseMessage('Update product variant')
  updateProductVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpsertProductVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto);
  }

  @Delete(':id/variants/:variantId')
  @RequirePermissions('manage_products')
  @ResponseMessage('Deactivate product variant')
  deactivateProductVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productsService.deactivateVariant(id, variantId);
  }

  @Post(':id/variants/:variantId/images')
  @RequirePermissions('manage_products')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Upload product variant image')
  uploadProductVariantImage(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @UploadedFile() file: UploadedImageFile,
  ) {
    return this.productsService.uploadVariantImage(id, variantId, file);
  }

  @Delete(':id/variants/:variantId/images/:imageId')
  @RequirePermissions('manage_products')
  @ResponseMessage('Delete product variant image')
  deleteProductVariantImage(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteVariantImage(id, variantId, imageId);
  }
  @Patch(':id/toggle-visibility')
  @RequirePermissions('manage_products')
  @ResponseMessage('Toggle product visibility')
  toggleProductVisibility(@Param('id') id: string) {
    return this.productsService.toggleVisibility(id);
  }

  @Patch(':id/toggle-featured')
  @RequirePermissions('manage_products')
  @ResponseMessage('Toggle product featured')
  toggleProductFeatured(@Param('id') id: string) {
    return this.productsService.toggleFeatured(id);
  }

  @Delete(':id')
  @RequirePermissions('manage_products')
  @ResponseMessage('Delete product')
  removeProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // â”€â”€â”€ Images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  @Public()
  @Get(':id/images')
  @ResponseMessage('Get product images')
  getProductImages(@Param('id') id: string) {
    return this.productsService.getProductImages(id);
  }

  @Post(':id/images')
  @RequirePermissions('manage_products')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Upload product image')
  uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: UploadedImageFile,
    @Body('isPrimary') isPrimary?: string,
  ) {
    return this.productsService.uploadProductImage(
      id,
      file,
      isPrimary === 'true',
    );
  }

  @Patch(':id/images/:imageId/set-primary')
  @RequirePermissions('manage_products')
  @ResponseMessage('Set primary image')
  setPrimaryImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.setPrimaryImage(id, imageId);
  }

  @Patch(':id/images/reorder')
  @RequirePermissions('manage_products')
  @ResponseMessage('Reorder product images')
  reorderProductImages(
    @Param('id') id: string,
    @Body() dto: ReorderImagesDto,
  ) {
    return this.productsService.reorderProductImages(id, dto);
  }

  @Delete(':id/images/:imageId')
  @RequirePermissions('manage_products')
  @ResponseMessage('Delete product image')
  deleteProductImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteProductImage(id, imageId);
  }

  // â”€â”€â”€ Description Images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  @Public()
  @Get(':id/description-images')
  @ResponseMessage('Get product description images')
  getDescriptionImages(@Param('id') id: string) {
    return this.productsService.getDescriptionImages(id);
  }

  @Post(':id/description-images')
  @RequirePermissions('manage_products')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Upload product description image')
  uploadDescriptionImage(
    @Param('id') id: string,
    @UploadedFile() file: UploadedImageFile,
  ) {
    return this.productsService.uploadDescriptionImage(id, file);
  }

  @Delete(':id/description-images/:imageId')
  @RequirePermissions('manage_products')
  @ResponseMessage('Delete product description image')
  deleteDescriptionImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productsService.deleteDescriptionImage(id, imageId);
  }
}

