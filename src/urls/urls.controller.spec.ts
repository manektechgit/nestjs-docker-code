import { Test } from '@nestjs/testing';

import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { UrlsModule } from './urls.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUrlDto } from './dto/create-url.dto';

describe('UrlsController', () => {
  let urlsController: UrlsController;
  let urlsService: UrlsService;

  const mockUrl = {
    shortUrl: 'http://surl.com/W0Jw-pUT',
    originalUrl: 'http://google.com/2',
    createdAt: new Date(),
    expireAt: new Date(),
    _id: '62b6c9647f49a94c49b615b3',
  };

  const createUrlDto: CreateUrlDto = {
    originalUrl: 'http://google.com/2',
    expireAt: 2,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
          `mongodb://localhost:27017/${process.env.DATABASE_NAME}`,
        ),
        UrlsModule,
      ],
    })
      .overrideProvider(UrlsService)
      .useValue({
        create: jest.fn().mockResolvedValue(createUrlDto),
        findAll: jest.fn().mockResolvedValueOnce([
          {
            shortUrl: 'http://surl.com/W0Jw-pUT',
            originalUrl: 'http://google.com/2',
            createdAt: new Date(),
            expireAt: new Date(),
            _id: '62b6c9647f49a94c49b615b3',
          },
        ]),
      })
      .compile();

    urlsController = moduleRef.get<UrlsController>(UrlsController);
    urlsService = moduleRef.get<UrlsService>(UrlsService);
  });

  describe('create()', () => {
    it('should create a new url', async () => {
      const createSpy = jest
        .spyOn(urlsService, 'create')
        .mockResolvedValueOnce(mockUrl);

      await urlsController.create(createUrlDto);
      expect(createSpy).toHaveBeenCalledWith(createUrlDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of urls', async () => {
      expect(urlsController.findAll()).resolves.toHaveLength(1);
      expect(urlsService.findAll).toHaveBeenCalled();
    });
  });
});
