import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountModule } from './count/count.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [CountModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
