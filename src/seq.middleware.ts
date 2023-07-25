import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import {logging} from './util';

export class MySequenceMiddleware extends MiddlewareSequence {
  async handle(context: RequestContext) {
    logging('before request');
    await super.handle(context);
    logging('after request');
  }
}
