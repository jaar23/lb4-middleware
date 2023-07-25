import {
  ApiConnectBindings,
  ApiConnectComponent,
  ApiConnectSpecOptions,
} from '@loopback/apiconnect';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class MwExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // [example 1]
    this.sequence(MySequence);

    // [example 2]
    // this.sequence(MySequenceMiddleware);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(ApiConnectComponent);
    const apiConnectOptions: ApiConnectSpecOptions = {
      targetUrl: 'http://localhost:3000/',
    };
    this.configure(ApiConnectBindings.API_CONNECT_SPEC_ENHANCER).to(
      apiConnectOptions,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // this.middleware(async (ctx, next) => {
    //   const {request} = ctx;
    //   console.log('Request: %s %s', request.method, request.originalUrl);
    // });
  }
}
