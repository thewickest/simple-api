import { Test, TestingModule } from '@nestjs/testing';
import { CountService } from './count.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('CountService', () => {
  let service: CountService;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountService>(CountService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the count from the cache', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(42);

    const result = await service.getCount();

    expect(cacheService.get).toHaveBeenCalledWith('count');
    expect(result).toBe(42);
  });

  it('should return null if count is not in the cache', async () => {
    (cacheService.get as jest.Mock).mockResolvedValue(null);

    const result = await service.getCount();

    expect(cacheService.get).toHaveBeenCalledWith('count');
    expect(result).toBeNull();
  });

  it('should throw an error if cache service fails', async () => {
    const error = new Error('Cache error');
    (cacheService.get as jest.Mock).mockRejectedValue(error);

    await expect(service.getCount()).rejects.toThrow('Cache error');
    expect(cacheService.get).toHaveBeenCalledWith('count');
  });
});
