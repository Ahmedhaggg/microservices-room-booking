import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  rabbitMqRoutingKeys,
  type UserRegisteredEvent,
  type UserUpdatedEvent,
} from 'libs/common';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto, UpdateUserDto } from '../dtos/user.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email "${email}" already exists.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userPayload = {
      email,
      password: hashedPassword,
      displayName: dto.displayName.trim(),
      roles: 'CUSTOMER' as const,
    };

    const user = await this.userRepository.createUser(userPayload);

    const eventPayload: UserRegisteredEvent = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    };
    
    this.notificationClient.emit(rabbitMqRoutingKeys.userRegistered, eventPayload);

    return {
      message: 'Registration successful',
      userId: user.id,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { userId: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const updates: any = { updatedAt: new Date() };
    if (dto.displayName) {
      updates.displayName = dto.displayName.trim();
    }

    await this.userRepository.updateUser(userId, updates);

    const updatedUser = await this.userRepository.findUserById(userId);
    
    if (updatedUser) {
      const eventPayload: UserUpdatedEvent = {
        userId: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        roles: updatedUser.roles,
        updatedAt: updatedUser.updatedAt.toISOString(),
      };
      this.notificationClient.emit(rabbitMqRoutingKeys.userUpdated, eventPayload);
    }

    return { message: 'User updated successfully' };
  }
}
