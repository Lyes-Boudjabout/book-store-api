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
import { BooksService } from './books.service';
import { CreateBookDTO, UpdateBookDTO } from './Book.dto';
import { Book } from 'src/schemas/Book.schema';
import { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { AdminAuthorizationGuard } from 'src/guards/adminAuthorization.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('books')
@UseGuards(AuthorizationGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id') id: string): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post()
  @UseGuards(AdminAuthorizationGuard)
  addBook(@Body() createBookDTO: CreateBookDTO): Promise<any> {
    return this.booksService.addBook(createBookDTO);
  }

  @Put(':id')
  @UseGuards(AdminAuthorizationGuard)
  updateBook(
    @Body() updateBookDTO: UpdateBookDTO,
    @Param('id') id: string,
  ): Promise<UpdateWriteOpResult> {
    return this.booksService.updateBook(id, updateBookDTO);
  }

  @Delete(':id')
  @UseGuards(AdminAuthorizationGuard)
  deleteBook(@Param('id') id: string): Promise<DeleteResult> {
    return this.booksService.deleteBook(id);
  }
}
