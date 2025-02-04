import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/routes/users/User.dto';
import { RefreshJwtGuard } from 'src/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginDTO: LoginDTO): Promise<any> {
    return this.authService.validateLoginUser(loginDTO);
  }

  @Post('register')
  signUpUser(@Body() createUserDTO: CreateUserDTO): Promise<any> {
    return this.authService.registerUser(createUserDTO);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req);
  }
}
