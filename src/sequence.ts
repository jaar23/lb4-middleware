import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {logging} from './util';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) {}
  async handle(context: RequestContext) {
    try {
      console.log('SEQUENCE:  trigger sequence');
      const {request, response} = context;
      const route = this.findRoute(request);
      console.log(`SEQUENCE:  ${route.path}`);
      console.log(`SEQUENCE:  ${request.method}`);
      const args = await this.parseParams(request, route);
      console.log(`SEQUENCE:  ${args ? 'No arguments' : args}`);
      if (request.method === 'PATCH') {
        args[1].updated = new Date();
      } else if (request.method === 'GET') {
        logging('This is a custom logging');
      }
      const result = await this.invoke(route, args);
      console.log(`SEQUENCE:  ${result}`);
      console.log('\n');
      this.send(response, result);
    } catch (err) {
      console.log(`SEQUENCE:  on error`);
      this.reject(context, err as Error);
      return;
    }
  }
}
