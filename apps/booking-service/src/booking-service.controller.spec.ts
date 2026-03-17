import { Test, TestingModule } from '@nestjs/testing';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';

describe('BookingServiceController', () => {
  let bookingServiceController: BookingServiceController;
  const bookingServiceMock = {
    getHello: jest.fn(() => 'booking-service ready'),
    getDatabaseHealth: jest.fn(async () => ({
      service: 'booking-service',
      database: 'up',
    })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookingServiceController],
      providers: [
        {
          provide: BookingServiceService,
          useValue: bookingServiceMock,
        },
      ],
    }).compile();

    bookingServiceController = app.get<BookingServiceController>(BookingServiceController);
  });

  describe('root', () => {
    it('should return the service readiness message', () => {
      expect(bookingServiceController.getHello()).toBe('booking-service ready');
    });

    it('should return the database health status', async () => {
      await expect(bookingServiceController.getDatabaseHealth()).resolves.toEqual({
        service: 'booking-service',
        database: 'up',
      });
    });
  });
});
