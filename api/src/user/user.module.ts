import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaModule } from 'src/database/database.module';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { UuidModule } from 'src/utils/uuid/uuid.module';

@Module({
  imports: [PrismaModule, UuidModule],
  controllers: [UsersController],
  providers: [UsersService, HashingService],
})
export class UsersModule {}
