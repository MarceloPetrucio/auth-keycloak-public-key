import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(
        private readonly authenticationService: AuthenticationService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let request: Request = context.switchToHttp().getRequest(); 

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;       

        const header = request.header('Authorization');

        if (!header) {
            throw new HttpException('Authorization: Bearer <token> header missing', HttpStatus.UNAUTHORIZED);
        }

        const parts = header.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new HttpException('Authorization: Bearer <token> header invalid', HttpStatus.UNAUTHORIZED);
        }

        const token = parts[1];
        
        try {
            // Store the user on the request object if we want to retrieve it from the controllers
            request['user'] = await this.authenticationService.authenticate(token);
            return true;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
        }
    }
}