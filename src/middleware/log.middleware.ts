import {Next, Provider, injectable} from '@loopback/core';
import {
  HttpErrors,
  Middleware,
  MiddlewareContext,
  Response,
  RestMiddlewareGroups,
  RestTags,
  asMiddleware,
} from '@loopback/rest';

@injectable(
  asMiddleware({
    group: 'sendResponse',
    chain: RestTags.REST_MIDDLEWARE_CHAIN,
    upstreamGroups: RestMiddlewareGroups.CORS,
    downstreamGroups: RestMiddlewareGroups.INVOKE_METHOD,
  }),
)
export class LogHandlerMiddlewareProvider implements Provider<Middleware> {
  constructor() {
    console.log('middleware loaded');
  }

  async value() {
    const middleware: Middleware = async (
      ctx: MiddlewareContext,
      next: Next,
    ) => {
      try {
        this.handleInfo(ctx, 'middleware is triggered');
        return await next();
      } catch (err) {
        return this.handleError(ctx, err);
      }
    };
    return middleware;
  }

  handleError(context: MiddlewareContext, err: HttpErrors.HttpError): Response {
    // We simply log the error although more complex scenarios can be performed
    // such as customizing errors for a specific endpoint
    console.log('err');
    throw err;
  }

  handleInfo(context: MiddlewareContext, logMsg: string): void {
    console.log(`${context.request.originalUrl}: ${logMsg}`);
  }
}

// const logMiddleware: Middleware = async (middlewareCtx, next) => {
//   const {request} = middlewareCtx;
//   console.log('Request: %s %s', request.method, request.originalUrl);
//   try {
//     // Proceed with next middleware
//     const result = await next();
//     // Process response
//     console.log(
//       'Response received for %s %s',
//       request.method,
//       request.originalUrl,
//     );
//     return result;
//   } catch (err) {
//     // Catch errors from downstream middleware
//     console.error(
//       'Error received for %s %s',
//       request.method,
//       request.originalUrl,
//     );
//     throw err;
//   }
// };

// app.middleware(log);
