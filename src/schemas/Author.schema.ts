import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Author {
  @Prop({ unique: true, required: true })
  fullName: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: false, default: 'default-avatar.png' })
  image?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
