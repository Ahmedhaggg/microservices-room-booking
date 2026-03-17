import { Test, TestingModule } from '@nestjs/testing';
import { DRIZZLE_DB } from 'libs/shared';
import { RoomsServiceService } from './rooms-service.service';

describe('RoomsServiceService', () => {
  let service: RoomsServiceService;
  const dbMock = {
    execute: jest.fn(async () => [{ result: 1 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsServiceService,
        {
          provide: DRIZZLE_DB,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<RoomsServiceService>(RoomsServiceService);
  });

  it('should report the database as healthy', async () => {
    await expect(service.getDatabaseHealth()).resolves.toEqual({
      service: 'rooms-service',
      database: 'up',
    });
    expect(dbMock.execute).toHaveBeenCalledTimes(1);
  });
});
