import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  it('should transform response', (done) => {
    const context = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
      }),
    };
    const handler = {
      handle: () => of('test'),
    };

    interceptor
      .intercept(context as any, handler as any)
      .subscribe((response) => {
        expect(response).toEqual({
          status: 200,
          data: 'test',
        });
        done();
      });
  });
});
