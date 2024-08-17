import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PrismaService } from 'src/database/database.service'; // Eğer Prisma kullanıyorsanız
import { PrismaModule } from 'src/database/database.module';

@Module({
  imports: [PrismaModule],
  providers: [SessionsService, PrismaService],
  controllers: [SessionsController],
})
export class SessionsModule {}
