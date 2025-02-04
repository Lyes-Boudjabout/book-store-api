import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('MONGO_URI');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  tryVerify(): any {
    const isAdmin: boolean = true;
    const _id: string = '679d2efff2ae66b93bdd55f0';
    const token = this.jwtService.sign({ isAdmin, _id }, { secret: 'abcd' });
    console.log(typeof token);
    const result = this.jwtService.verify(token, { secret: 'abcd' });
    return result.isAdmin;
  }
}
