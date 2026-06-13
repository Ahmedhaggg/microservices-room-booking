import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationServiceService } from './notification-service.service';
import {
  rabbitMqRoutingKeys,
  type BookingConfirmedEvent,
  type BookingRejectedEvent,
  type UserRegisteredEvent,
} from 'libs/common';

@Controller()
export class NotificationEventController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @EventPattern(rabbitMqRoutingKeys.userRegistered)
  async handleUserRegistered(
    @Payload() payload: UserRegisteredEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.notificationServiceService.handleUserRegistered(payload);
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }

  @EventPattern(rabbitMqRoutingKeys.bookingConfirmed)
  async handleBookingConfirmed(
    @Payload() payload: BookingConfirmedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.notificationServiceService.handleBookingConfirmed(payload);
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }

  @EventPattern(rabbitMqRoutingKeys.bookingRejected)
  async handleBookingRejected(
    @Payload() payload: BookingRejectedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.notificationServiceService.handleBookingRejected(payload);
      channel.ack(originalMessage);
    } catch (error) {
      channel.nack(originalMessage, false, true);
    }
  }
}
