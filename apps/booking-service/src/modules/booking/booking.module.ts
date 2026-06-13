import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BookingController } from './controllers/booking.controller';
import { BookingEventController } from './controllers/booking-event.controller';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/booking.repository';

@Module({
  imports: [ClientsModule],
  controllers: [BookingController, BookingEventController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
