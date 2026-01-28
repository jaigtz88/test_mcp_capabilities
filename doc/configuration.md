[GoTo Readme](../README.md)

[GoTo Overview](./overview.md)

# Configuration Documentation

We divide configuration example into 2 part which is via ngModule and single component. You can chose either one depend on your Angular current implementation. If your Angular app already using single component, you can directly use single component implementation section below.

## Configuration Properties

```ts
import { IxxAuthorizationConfig } from './Data/ixx-authorization-config';
import { IxxLogLevel } from './iXXX/Data/ixx-log-level-enum';

{
    trustedUrlPrefixes: [ "https://your-api-server.com", "https://your-additional-server.com" ],
    appClaimProviderUrl: "https://your-api-server.com/api/config/claims",
    appJwtCacheProviderUrl: "https://your-api-server.com/api/config/jwtcache",
    logLevel: IxxLogLevel.Info,
    oidcConfigIds: [ "kerberos", "credentials" ]
} as IxxAuthorizationConfig
```

- `trustedUrlPrefixes`: define all URL prefixes you are trusting. The HTTP Interceptor only attaches the JWT token to requests with a trusted URL. It is always a `startsWith()` check. Therefore you do not need to specify all full qualified URIs. **NOTE**: You need to use HTTPS for all URIs. Only localhost is allowed to use HTTP only.
- `appClaimProviderUrl`: the URL of your server which provides the endpoint to provide the JWT for SignalR authentication. The default implementation is registered at your server startup. The URL is always: `https://your-server.com/api/config/jwtcache`. The API just requires the Authorization header and returns a one-time-token which need to be send as argument for `access_token`. There is a support method which provides you all the support that you can read here: [SignalR integration](./signalr.md).
- `appJwtCacheProviderUrl`: the URL of your server which provides the claims for your Angular application. The default implementation is registered at your server startup. The URL is always: `https://your-server.com/api/config/claims`. A description of the API can be viewed in the documentation.
- `logLevel`: define your LogLevel. For production, you can set to an Error for only showing an error. **NOTE**: Angular will remove all `console.log(...)` commands from production builds.
- `oidcConfigIds`: define all your configuration Ids define in the authentication. This is required to access the correct JWT. Note that the order matters! The first registered one is the default one.

**NOTE**: be aware that a malformed or incomplete configuration will result in startup errors. You can find a list of all possible errors in [Error Descriptions](./error-descriptions.md).

## Load Configuration From JSON Files

### ngModule implementation

```ts
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { IxxAuthorizationModule } from "./iXXX/ixx-authorization.module";
import { IxxAuthorizationConfig } from "./iXXX/Data/ixx-authorization-config";
import { IxxLogLevel } from "./iXXX/Data/ixx-log-level-enum";

export const httpLoaderFactoryIXXX = (httpClient: HttpClient) => {
  const configIXXX$ = httpClient.get<IxxAuthorizationConfig>(`${window.location.origin}/assets/auth/iXXX.json`).pipe(
    map((customConfig: IxxAuthorizationConfig) => {
      customConfig.logLevel = environment.production ? IxxLogLevel.Error : IxxLogLevel.Info;
      return customConfig;
    })
  );

  return configIXXX$;
};

@NgModule({
  imports: [IxxAuthorizationModule.forRootWithProvider(httpLoaderFactoryIXXX)],
  exports: [AuthModule, IxxAuthorizationModule],
})
export class AuthConfigModule {}
```

### Single Component implementation

```ts
import { IxxAuthorizationConfig, IxxAuthorizationModule, IxxLogLevel } from "angular-iXXX-authorization";

// ...

// load the iXXX configuration file the same way as the authentication files
export const httpLoaderFactoryIXXX = (httpClient: HttpClient) => {
  const configIXXX$ = httpClient.get<IxxAuthorizationConfig>(`${window.location.origin}/assets/auth/iXXX.json`).pipe(
    map((customConfig: IxxAuthorizationConfig) => {
      customConfig.logLevel = environment.production ? IxxLogLevel.Error : IxxLogLevel.Info;
      return customConfig;
    })
  );

  return configIXXX$;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    importProvidersFrom(IxxAuthorizationModule.forRootWithProvider(httpLoaderFactoryIXXX)),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
  ],
};
```

## Embedded Configuration in Source Code

### ngModule implementation

```ts
import { IxxAuthorizationModule } from "./iXXX/ixx-authorization.module";
import { IxxLogLevel } from "./iXXX/Data/ixx-log-level-enum";

@NgModule({
  imports: [
    IxxAuthorizationModule.forRoot(
      {
        trustedUrlPrefixes: ["https://your-api-server.com", "https://your-additional-server.com"],
        appClaimProviderUrl: "https://your-api-server.com/api/config/claims",
        appJwtCacheProviderUrl: "https://your-api-server.com/api/config/jwtcache",
        logLevel: IxxLogLevel.Info,
        oidcConfigIds: ["kerberos", "credentials"],
      },
      false
    ),
  ],
  exports: [AuthModule, IxxAuthorizationModule],
})
export class AuthConfigModule {}
```

### Single Component implementation

```ts
import { ApplicationConfig } from "@angular/core";
import { IxxLogLevel } from "./iXXX/Data/ixx-log-level-enum";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      IxxAuthorizationModule.forRoot({
        trustedUrlPrefixes: ["https://your-api-server.com", "https://your-additional-server.com"],
        appClaimProviderUrl: "https://your-api-server.com/api/config/claims",
        appJwtCacheProviderUrl: "https://your-api-server.com/api/config/jwtcache",
        logLevel: environment.production ? IxxLogLevel.Error : IxxLogLevel.Info,
        oidcConfigIds: ["kerberos", "credentials"],
      })
    ),
  ],
};
```

## Disable HTTP Interceptor

You may have your own HTTP interceptor serving the JWT for all HTTP Requests or you need to define it on your self for every single request for whatever reason. You can disable the interceptor at module initialization time.

By default the interceptor is registered. The second parameter is optional and the value `true` disables the interceptor registration.

### ngModule implementation

```ts
// using HTTP config loader
IxxAuthorizationModule.forRootWithProvider(httpLoaderFactoryIXXX, true);

// using static config
IxxAuthorizationModule.forRoot(
  {
    /* place config here */
  },
  true
);
```

### Single Component implementation

```ts
// using HTTP config loader
importProvidersFrom(
  IxxAuthorizationModule.forRootWithProvider(httpLoaderFactoryIXXX, true)
),

// using static config
importProvidersFrom(
  IxxAuthorizationModule.forRoot(
    {
      /* place config here */
    },
    true
  )
),
```
