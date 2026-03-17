import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let notificationServiceController: NotificationServiceController;
  const notificationServiceMock = {
    getHello: jest.fn(() => 'notification-service ready'),
    getDatabaseHealth: jest.fn(async () => ({
      service: 'notification-service',
      database: 'up',
    })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationServiceController],
      providers: [
        {
          provide: NotificationServiceService,
          useValue: notificationServiceMock,
        },
      ],
    }).compile();

    notificationServiceController = app.get<NotificationServiceController>(NotificationServiceController);
  });

  describe('root', () => {
    it('should return the service readiness message', () => {
      expect(notificationServiceController.getHello()).toBe(
        'notification-service ready',
      );
    });

    it('should return the database health status', async () => {
      await expect(
        notificationServiceController.getDatabaseHealth(),
      ).resolves.toEqual({
        service: 'notification-service',
        database: 'up',
      });
    });
  });
});
