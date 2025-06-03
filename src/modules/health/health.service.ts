import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}

  getHealthStatus() {
    return 'OK'; // TODO: Implement health check for mongo, redis, etc.
  }
}
