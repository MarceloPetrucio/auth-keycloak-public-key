import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './authentication/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health-check')
  getHello() {
    return {
      status: "ok"
    };
  }

  @Get('/user')
  teste(@Request() req){
    return req.user;
  }
}
