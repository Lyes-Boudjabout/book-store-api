import { Body, Controller, Param, Post } from '@nestjs/common';
import { ForgetPasswordDTO, ResetPasswordDTO } from './password.dto';
import { PasswordService } from './password.service';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDTO: ForgetPasswordDTO): Promise<any> {
    return this.passwordService.forgetPassword(forgotPasswordDTO);
  }

  @Post('reset-password/:id/:token')
  resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @Param('token') token: string,
    @Param('id') id: string,
  ): Promise<UpdateWriteOpResult> {
    return this.passwordService.resetPassword(resetPasswordDTO, token, id);
  }
}
