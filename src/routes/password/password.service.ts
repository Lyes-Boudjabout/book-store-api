import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { ForgetPasswordDTO, ResetPasswordDTO } from './password.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO): Promise<any> {
    const { email } = forgetPasswordDTO;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('Something went wrong', 403);
    }
    const data = user.toJSON();
    const secret = process.env.JWT_SECRET + data.password;
    const PORT = process.env.PORT;
    const token: string = this.jwtService.sign(
      {
        isAdmin: data.isAdmin,
        id: data._id,
      },
      {
        secret: secret,
      },
    );
    return {
      url: `http://localhost:${PORT}/password/reset-password/${data._id}/${token}`,
    };
  }

  async resetPassword(
    resetPasswordDTO: ResetPasswordDTO,
    token: string,
    id: string,
  ): Promise<UpdateWriteOpResult> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new HttpException('Something went wrong', 403);
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      this.jwtService.verify(token, {
        secret: secret,
        ignoreExpiration: false,
      });
      const { password } = resetPasswordDTO;
      const salt = await bcryptjs.genSalt(10);
      resetPasswordDTO.password = await bcryptjs.hash(password, salt);
      const result = await this.userModel.updateOne(
        { _id: id },
        { $set: resetPasswordDTO },
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
