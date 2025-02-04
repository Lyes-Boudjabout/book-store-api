import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { LoginDTO } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDTO } from 'src/routes/users/User.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateLoginUser(loginDTO: LoginDTO): Promise<any> {
    const { email, password } = loginDTO;
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new HttpException('User Not Found', 404);
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new HttpException('Incorrect Email or Password', 400);
    } else {
      const data = user.toJSON();
      delete data.password;
      const token = this.jwtService.sign({
        isAdmin: data.isAdmin,
        id: data._id,
      });
      return {
        accessToken: token,
        data: data,
        refreshToken: this.jwtService.sign(
          {
            isAdmin: data.isAdmin,
            id: data._id,
          },
          { expiresIn: '7d' },
        ),
      };
    }
  }

  async registerUser(createUserDTO: CreateUserDTO): Promise<any> {
    const { email, password } = createUserDTO;

    let user = await this.userModel.findOne({ email: email });
    if (user) throw new HttpException('User Already Exists', 409);

    const salt = await bcryptjs.genSalt(10);
    createUserDTO.password = await bcryptjs.hash(password, salt);
    user = new this.userModel(createUserDTO);
    const savedUser = await user.save();

    const data = user.toJSON();
    const token = this.jwtService.sign({
      isAdmin: data.isAdmin,
      id: savedUser._id,
    });
    delete data.password;
    return {
      accessToken: token,
      data: data,
      refreshToken: this.jwtService.sign(
        {
          isAdmin: data.isAdmin,
          id: savedUser._id,
        },
        { expiresIn: '7d' },
      ),
    };
  }

  async refreshToken(req: any) {
    const user = req.user;
    return {
      accessToken: this.jwtService.sign({
        isAdmin: user.isAdmin,
        id: user._id,
      }),
    };
  }
}
