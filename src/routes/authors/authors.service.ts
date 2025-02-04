import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateWriteOpResult } from 'mongoose';
import { Author } from 'src/schemas/Author.schema';
import { CreateAuthorDTO, UpdateAuthorDTO } from './Author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  async getAllAuthors(): Promise<Author[]> {
    return await this.authorModel.find();
  }

  async getAuthorById(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id);
    if (!author) throw new HttpException('Author not found', 404);
    return author;
  }

  async createAuthor(createAuthorDTO: CreateAuthorDTO): Promise<any> {
    const { fullName } = createAuthorDTO;
    const author = await this.authorModel.findOne({ fullName: fullName });
    if (author) throw new HttpException('Author Already Exists', 409);
    const newAuthor = new this.authorModel(createAuthorDTO);
    return await newAuthor.save();
  }

  // eslint-disable-next-line prettier/prettier
  async updateAuthor(id: string, updateAuthorDTO: UpdateAuthorDTO): Promise<UpdateWriteOpResult> {
    const author = await this.authorModel.findById(id);
    if (!author) throw new HttpException('Author not found', 404);
    const updatedAuthor = await this.authorModel.updateOne(
      { _id: id },
      { $set: updateAuthorDTO },
    );
    return updatedAuthor;
  }

  async deleteAuthor(id: string): Promise<DeleteResult> {
    const author = await this.authorModel.findById(id);
    if (!author) throw new HttpException('Author not found', 404);
    const deletedAuthor = await this.authorModel.deleteOne({ _id: id });
    return deletedAuthor;
  }
}
