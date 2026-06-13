import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';

export const createBookingSchema = z.object({
  userId: z.string({ message: 'userId is required.' }).trim().min(1, { message: 'userId is required.' }),
  roomId: z.string({ message: 'roomId is required.' }).trim().min(1, { message: 'roomId is required.' }),
  startsAt: z.string({ message: 'startsAt is required.' }).trim().min(1, { message: 'startsAt is required.' }).refine(
    (val) => !isNaN(new Date(val).getTime()),
    { message: 'startsAt must be a valid ISO date string.' }
  ),
  endsAt: z.string({ message: 'endsAt is required.' }).trim().min(1, { message: 'endsAt is required.' }).refine(
    (val) => !isNaN(new Date(val).getTime()),
    { message: 'endsAt must be a valid ISO date string.' }
  ),
}).refine(
  (data) => new Date(data.startsAt) < new Date(data.endsAt),
  {
    message: 'startsAt must be before endsAt.',
    path: ['startsAt'],
  }
);

export class CreateBookingDto {
  userId!: string;
  roomId!: string;
  startsAt!: string;
  endsAt!: string;
}

export function validateCreateBooking(data: unknown): CreateBookingDto {
  const result = createBookingSchema.safeParse(data);
  if (!result.success) {
    const error = result.error.issues[0];
    throw new BadRequestException(error.message);
  }
  return result.data as CreateBookingDto;
}
