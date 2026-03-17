import { Test, TestingModule } from '@nestjs/testing';
import { DRIZZLE_DB } from 'libs/shared';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceService', () => {
  let service: NotificationServiceService;
  const dbMock = {
    execute: jest.fn(async () => [{ result: 1 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationServiceService,
        {
          provide: DRIZZLE_DB,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<NotificationServiceService>(NotificationServiceService);
  });

  it('should report the database as healthy', async () => {
    await expect(service.getDatabaseHealth()).resolves.toEqual({
      service: 'notification-service',
      database: 'up',
    });
    expect(dbMock.execute).toHaveBeenCalledTimes(1);
  });
});
