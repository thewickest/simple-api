import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { appendFileSync } from 'fs';
import { CreateTrackDto } from './dto/create-track.dto';
import { InternalServerErrorException } from '@nestjs/common';

// Mock the appendFileSync function
jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
}));

describe('TrackService', () => {
  let service: TrackService;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update the count in cache if count is provided in DTO', async () => {
    const createTrackDto: CreateTrackDto = { count: 5, data: 'data' };
    (cacheService.get as jest.Mock).mockResolvedValue('10');

    const result = await service.create(createTrackDto);

    expect(cacheService.get).toHaveBeenCalledWith('count');
    expect(cacheService.set).toHaveBeenCalledWith('count', 15);
    expect(appendFileSync).toHaveBeenCalledWith('./data.json',  `${JSON.stringify(createTrackDto)}\n`);
    expect(result).toEqual(createTrackDto);
  });

  it('should set count to the given count if no value is in cache', async () => {
    const createTrackDto: CreateTrackDto = { count: 3, data: 'another data' };
    (cacheService.get as jest.Mock).mockResolvedValue(null);

    const result = await service.create(createTrackDto);

    expect(cacheService.get).toHaveBeenCalledWith('count');
    expect(cacheService.set).toHaveBeenCalledWith('count', 3);
    expect(appendFileSync).toHaveBeenCalledWith('./data.json',  `${JSON.stringify(createTrackDto)}\n`);
    expect(result).toEqual(createTrackDto);
  });

  it('should append data to the file even if count is not provided', async () => {
    const createTrackDto: CreateTrackDto = { data: 'data without count' };

    const result = await service.create(createTrackDto);

    expect(cacheService.get).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(appendFileSync).toHaveBeenCalledWith('./data.json',  `${JSON.stringify(createTrackDto)}\n`);
    expect(result).toEqual(createTrackDto);
  });

  it('should throw an InternalServerErrorException if an error occurs', async () => {
    const createTrackDto: CreateTrackDto = { count: 1, data: 'failing track' };
    (cacheService.get as jest.Mock).mockRejectedValue(new Error('Cache error'));
  
    await expect(service.create(createTrackDto)).rejects.toThrow(InternalServerErrorException);
  
    expect(cacheService.get).toHaveBeenCalledWith('count');
    expect(appendFileSync).not.toHaveBeenCalled(); // Ensure file operation is not performed
  });
});
