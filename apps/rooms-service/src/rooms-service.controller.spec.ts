import { Test, TestingModule } from '@nestjs/testing';
import { RoomsServiceController } from './rooms-service.controller';
import { RoomsServiceService } from './rooms-service.service';

describe('RoomsServiceController', () => {
  let roomsServiceController: RoomsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoomsServiceController],
      providers: [RoomsServiceService],
    }).compile();

    roomsServiceController = app.get<RoomsServiceController>(RoomsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(roomsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
