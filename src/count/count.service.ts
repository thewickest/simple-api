import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CountService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getCount() {
    return await this.cacheService.get('count');
  }
}
