import { HttpModule, Module } from '@nestjs/common';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { ManualAuthenticationStrategy } from './manual.strategy';

@Module({
  imports:[
    HttpModule
  ],
  providers:[
    AuthenticationGuard,
    AuthenticationService,
    ManualAuthenticationStrategy
  ],
  exports: [
    AuthenticationService
  ]
})
export class AuthenticationModule {}
