import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateWriteOpResult } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import * as bcryptjs from 'bcryptjs';
import { UpdateUserDTO } from './User.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().select('-password');
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new HttpException('User Not Found', 404);
    return user;
  }

  // eslint-disable-next-line prettier/prettier
  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<UpdateWriteOpResult> {
    const user = await this.userModel.findById(id);
    const { password } = updateUserDTO;

    if (!user) throw new HttpException("User doesn't exist", 404);

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateUserDTO.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await this.userModel.updateOne(
      { _id: id },
      { $set: updateUserDTO },
    );

    return updatedUser;
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException("User doesn't exist", 404);
    const deletedUser = await this.userModel.deleteOne({ _id: id });
    return deletedUser;
  }
}
