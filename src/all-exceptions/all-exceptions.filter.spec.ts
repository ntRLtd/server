import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
  });

  it('should transform exception', () => {
    const exception = new HttpException('test', HttpStatus.BAD_REQUEST);
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/test' }),
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
      }),
    };

    filter.catch(exception, host as any);

    expect(host.switchToHttp().getResponse().status).toHaveBeenCalledWith(
      HttpStatus.BAD_REQUEST,
    );
    expect(host.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'test',
      timestamp: expect.any(String),
      path: '/test',
    });
  });
});
