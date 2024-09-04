import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/database/database.service';

@Controller({ path: 'cron', version: '1' })
@ApiTags('Cron')
export class CronController {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron('0 0 * * *')
  async handleExpiredPosts() {
    const now = new Date();
    try {
      // Süresi dolmuş postları sil
      const deletedPosts = await this.prismaService.post.deleteMany({
        where: {
          expireAt: {
            lte: now, // expireAt şimdiki zamandan küçük veya eşit olan postlar
          },
        },
      });
      console.log(`Deleted ${deletedPosts.count} expired posts`);
    } catch (error) {
      console.error('Error deleting expired posts:', error);
    }
  }
}
