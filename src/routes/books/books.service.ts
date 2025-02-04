import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateWriteOpResult } from 'mongoose';
import { Author } from 'src/schemas/Author.schema';
import { Book } from 'src/schemas/Book.schema';
import { CreateBookDTO, UpdateBookDTO } from './Book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    return await this.bookModel.find().populate('author');
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('author');
    if (!book) throw new HttpException('Book not found', 404);
    return book;
  }

  async addBook({ author, ...createBookDTO }: CreateBookDTO): Promise<any> {
    const author1 = await this.authorModel.findOne({
      fullName: author.fullName,
    });
    let book: any;
    if (!author1) {
      if (author.fullName && author.nationality) {
        const newAuthor = new this.authorModel(author);
        const savedAuthor = await newAuthor.save();
        book = new this.bookModel({
          ...createBookDTO,
          author: savedAuthor._id,
        });
      } else {
        throw new HttpException(
          'The full name and the nationality of the author should be provided',
          400,
        );
      }
    } else {
      book = new this.bookModel({
        ...createBookDTO,
        author: author1._id,
      });
    }
    return await book.save();
  }

  // eslint-disable-next-line prettier/prettier
  async updateBook(id: string, updateBookDTO: UpdateBookDTO): Promise<UpdateWriteOpResult> {
    const { author, ...other } = updateBookDTO;
    const book = await this.bookModel.findById(id).populate('author');
    if (!book) throw new HttpException('Book not found', 404);
    if (author) {
      const updatedAuthor = await this.authorModel.updateOne(
        { fullName: book.author.fullName },
        { $set: author },
      );
      if (updatedAuthor.matchedCount === 0)
        throw new HttpException('Author Not Found', 404);
    }
    const updatedBook = await this.bookModel.updateOne(
      { _id: id },
      { $set: other },
    );
    return updatedBook;
  }

  async deleteBook(id: string): Promise<DeleteResult> {
    const book = await this.bookModel.findById(id).populate('author');
    if (!book) throw new HttpException('Book not found', 404);
    const deletedBook = await this.bookModel.deleteOne({ _id: id });
    return deletedBook;
  }
}
