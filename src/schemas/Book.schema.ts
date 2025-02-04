import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Author } from './Author.schema';
import { typeCover } from 'types';

@Schema()
export class Book {
  @Prop({ unique: true, required: true })
  title: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  author: Author;
  @Prop({ required: false })
  description?: string;
  @Prop({ required: false })
  cover?: typeCover;
  @Prop({ required: true })
  price: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
