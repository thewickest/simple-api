import { Controller, Get } from '@nestjs/common';
import { CountService } from './count.service';

@Controller('count')
export class CountController {
  constructor(private readonly countService: CountService) {}

  @Get()
  findAll() {
    return this.countService.findAll();
  }
}
