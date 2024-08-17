import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number; uuid: string }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
      select: { id: true, uuid: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, uuid: user.uuid, email: user.email };
  }
}
