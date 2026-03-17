import { Test, TestingModule } from '@nestjs/testing';
import { DRIZZLE_DB } from 'libs/shared';
import { BookingServiceService } from './booking-service.service';

describe('BookingServiceService', () => {
  let service: BookingServiceService;
  const dbMock = {
    execute: jest.fn(async () => [{ result: 1 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingServiceService,
        {
          provide: DRIZZLE_DB,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<BookingServiceService>(BookingServiceService);
  });

  it('should report the database as healthy', async () => {
    await expect(service.getDatabaseHealth()).resolves.toEqual({
      service: 'booking-service',
      database: 'up',
    });
    expect(dbMock.execute).toHaveBeenCalledTimes(1);
  });
});
