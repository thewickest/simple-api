import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { appendFileSync } from 'fs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TrackService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async create(createTrackDto: CreateTrackDto) {
    try {
      if(createTrackDto.count) {
        const count = Number(await this.cacheService.get('count')) || 0
        await this.cacheService.set('count', count + createTrackDto.count)
      }
      appendFileSync('./data.json', `${JSON.stringify(createTrackDto)}\n`)
      return createTrackDto
    } catch (e) {
      throw new InternalServerErrorException
    }
  }
}
