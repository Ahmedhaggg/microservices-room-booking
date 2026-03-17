import { Test, TestingModule } from '@nestjs/testing';
import { RoomsServiceController } from './rooms-service.controller';
import { RoomsServiceService } from './rooms-service.service';

describe('RoomsServiceController', () => {
  let roomsServiceController: RoomsServiceController;
  const roomsServiceMock = {
    getHello: jest.fn(() => 'rooms-service ready'),
    getDatabaseHealth: jest.fn(async () => ({
      service: 'rooms-service',
      database: 'up',
    })),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoomsServiceController],
      providers: [
        {
          provide: RoomsServiceService,
          useValue: roomsServiceMock,
        },
      ],
    }).compile();

    roomsServiceController = app.get<RoomsServiceController>(RoomsServiceController);
  });

  describe('root', () => {
    it('should return the service readiness message', () => {
      expect(roomsServiceController.getHello()).toBe('rooms-service ready');
    });

    it('should return the database health status', async () => {
      await expect(roomsServiceController.getDatabaseHealth()).resolves.toEqual({
        service: 'rooms-service',
        database: 'up',
      });
    });
  });
});
