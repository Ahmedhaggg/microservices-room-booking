import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email('Valid email is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  displayName: z.string().min(1, 'Display name is required.'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

const LoginSchema = z.object({
  email: z.string().email('Valid email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export class LoginDto extends createZodDto(LoginSchema) {}

const UpdateUserSchema = z.object({
  displayName: z.string().min(1, 'Display name is required.').optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
