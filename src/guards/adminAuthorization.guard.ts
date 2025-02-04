import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) throw new UnauthorizedException('Only admin authorized');
      request.user = this.jwtService.verify(token);
      return request.user.isAdmin;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Only admin authorized');
    }
  }
}
