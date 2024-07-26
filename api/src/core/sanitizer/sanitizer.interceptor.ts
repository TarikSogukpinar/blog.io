import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain, plainToClass } from 'class-transformer';
import { sanitizeInput } from './sanitizer';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.sanitizeResponse(data);
      }),
    );
  }

  private sanitizeResponse(response: any) {
    if (typeof response === 'object' && response !== null) {
      const transformed = classToPlain(response);
      Object.keys(transformed).forEach((key) => {
        transformed[key] = sanitizeInput(transformed[key]);
      });
      return plainToClass(response.constructor, transformed);
    }
    return response;
  }
}
