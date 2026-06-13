import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RoomsServiceService } from './rooms-service.service';
import {
  rabbitMqRoutingKeys,
  type BookingRequestedEvent,
} from 'libs/common';

@Controller()
export class RoomsEventController {
  constructor(private readonly roomsServiceService: RoomsServiceService) {}

  @EventPattern(rabbitMqRoutingKeys.bookingRequested)
  async handleBookingRequested(
    @Payload() payload: BookingRequestedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.roomsServiceService.handleBookingRequested(payload);
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }
}
