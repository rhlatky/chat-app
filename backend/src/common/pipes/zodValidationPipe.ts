import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

type ValidationErrorPayload = {
  message: string;
  errors: unknown;
};

type ExceptionFactory = (payload: ValidationErrorPayload) => Error;

const defaultExceptionFactory: ExceptionFactory = (payload) => new BadRequestException(payload);

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: z.ZodTypeAny,
    private readonly exceptionFactory: ExceptionFactory = defaultExceptionFactory,
  ) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw this.exceptionFactory({
        message: 'Validation failed',
        errors: z.treeifyError(result.error),
      });
    }

    return result.data;
  }
}
