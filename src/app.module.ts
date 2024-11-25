import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountModule } from './count/count.module';
import { TrackModule } from './track/track.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [CountModule, TrackModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      /**For development purpouses we are not creating a .env file */
      host: 'localhost',
      port: 6379,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
