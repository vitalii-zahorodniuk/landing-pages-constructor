import {
  Controller,
  Get,
  Header,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggingInterceptor, PageDataInterceptor } from '../../interceptors';
import { ThrottlingGuard } from '../../guards/throttling.guard';

@Controller()
@UseInterceptors(PageDataInterceptor, LoggingInterceptor)
@UseGuards(ThrottlingGuard)
export class LandingController {
  constructor() {}

  @Get('/')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  renderLanding(@Res() response: Response) {
    return response.send('OK!');
  }

  @Get('/manifest.json')
  @Header('Content-Type', 'application/json')
  getManifest() {
    return '';
  }

  @Get('/favicon.ico')
  getFavicon() {
    return '';
  }
}
