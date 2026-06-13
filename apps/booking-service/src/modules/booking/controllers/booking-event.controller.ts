import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BookingService } from '../services/booking.service';
import {
  rabbitMqRoutingKeys,
  type RoomReservationConfirmedEvent,
  type RoomReservationRejectedEvent,
} from 'libs/common';

@Controller()
export class BookingEventController {
  constructor(private readonly bookingService: BookingService) {}

  @EventPattern(rabbitMqRoutingKeys.roomReservationConfirmed)
  async handleRoomReservationConfirmed(
    @Payload() payload: RoomReservationConfirmedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.bookingService.handleRoomReservationConfirmed({
        eventId: (originalMessage.properties.messageId as string) ?? payload.bookingId,
        payload,
      });
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }

  @EventPattern(rabbitMqRoutingKeys.roomReservationRejected)
  async handleRoomReservationRejected(
    @Payload() payload: RoomReservationRejectedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.bookingService.handleRoomReservationRejected({
        eventId: (originalMessage.properties.messageId as string) ?? payload.bookingId,
        payload,
      });
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }
}
