import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
