import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAndUserAuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const userIdFromParams = request.params.id;
      console.log(userIdFromParams);
      if (user.isAdmin || userIdFromParams === user.id) return true;
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException();
    }
  }
}
