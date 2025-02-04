import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './User.dto';
import { User } from 'src/schemas/User.schema';
import { DeleteResult, UpdateWriteOpResult } from 'mongoose';
import { AdminAuthorizationGuard } from 'src/guards/adminAuthorization.guard';
import { AdminAndUserAuthorizationGuard } from 'src/guards/adminAndUser.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@UseGuards(AuthorizationGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AdminAuthorizationGuard)
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AdminAndUserAuthorizationGuard)
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @UseGuards(AdminAndUserAuthorizationGuard)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UpdateWriteOpResult> {
    return this.usersService.updateUser(id, updateUserDTO);
  }

  @Delete(':id')
  @UseGuards(AdminAndUserAuthorizationGuard)
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }
}
