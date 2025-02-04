import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO, UpdateAuthorDTO } from './Author.dto';
import { Author } from 'src/schemas/Author.schema';
import { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { AdminAuthorizationGuard } from 'src/guards/adminAuthorization.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('authors')
@UseGuards(AuthorizationGuard)
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  getAllAuthors(): Promise<Author[]> {
    return this.authorsService.getAllAuthors();
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string): Promise<Author> {
    return this.authorsService.getAuthorById(id);
  }

  @Post()
  @UseGuards(AdminAuthorizationGuard)
  createAuthor(@Body() createAuthorDTO: CreateAuthorDTO): Promise<any> {
    return this.authorsService.createAuthor(createAuthorDTO);
  }

  @Put(':id')
  @UseGuards(AdminAuthorizationGuard)
  updateAuthor(
    @Body() updateAuthorDTO: UpdateAuthorDTO,
    @Param('id') id: string,
  ): Promise<UpdateWriteOpResult> {
    return this.authorsService.updateAuthor(id, updateAuthorDTO);
  }

  @Delete(':id')
  @UseGuards(AdminAuthorizationGuard)
  deleteAuthor(@Param('id') id: string): Promise<DeleteResult> {
    return this.authorsService.deleteAuthor(id);
  }
}
