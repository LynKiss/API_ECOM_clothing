import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Public,
  RequirePermissions,
  ResponseMessage,
} from '../decorator/customize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

type UploadedImageFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ResponseMessage('Get active categories')
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get('tree')
  @ResponseMessage('Get active category tree')
  getCategoryTree() {
    return this.categoriesService.findTree();
  }

  @Get('admin')
  @RequirePermissions('manage_products')
  @ResponseMessage('Get categories for admin')
  getCategoriesForAdmin() {
    return this.categoriesService.findAllForAdmin();
  }

  @Get('admin/tree')
  @RequirePermissions('manage_products')
  @ResponseMessage('Get category tree for admin')
  getCategoryTreeForAdmin() {
    return this.categoriesService.findTreeForAdmin();
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Get category detail')
  getCategory(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @RequirePermissions('manage_products')
  @ResponseMessage('Create category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @RequirePermissions('manage_products')
  @ResponseMessage('Update category')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Post(':id/image')
  @RequirePermissions('manage_products')
  @ResponseMessage('Upload category image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Param('id') id: string, @UploadedFile() file: UploadedImageFile) {
    return this.categoriesService.uploadImage(id, file);
  }

  @Patch(':id/reorder')
  @RequirePermissions('manage_products')
  @ResponseMessage('Reorder category')
  reorderCategory(
    @Param('id') id: string,
    @Body() reorderCategoryDto: ReorderCategoryDto,
  ) {
    return this.categoriesService.reorder(id, reorderCategoryDto);
  }

  @Delete(':id')
  @RequirePermissions('manage_products')
  @ResponseMessage('Delete category')
  removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
