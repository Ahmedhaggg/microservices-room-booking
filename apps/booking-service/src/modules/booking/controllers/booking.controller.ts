import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../validation/booking.validation';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('bookings')
  createBooking(@Body() body: CreateBookingDto) {
    return this.bookingService.createBooking(body);
  }

  @Get('bookings/:id')
  getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }
}
