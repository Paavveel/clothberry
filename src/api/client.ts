import { v4 as uuidv4 } from 'uuid';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder, HttpMiddlewareOptions, UserAuthOptions } from '@commercetools/sdk-client-v2';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
const authHost = import.meta.env.VITE_CTP_AUTH_URL;
const apiHost = import.meta.env.VITE_CTP_API_URL;
const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
const scopes = import.meta.env.VITE_CTP_SCOPES;

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiHost,
  fetch,
};

class CreateApi {
  private client = new ClientBuilder();

  public anonymousID = uuidv4();

  public request = this.getAnonymousFlowApi();

  private getAnonymousFlowApi() {
    const client = this.client
      .withAnonymousSessionFlow({
        host: authHost,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
          anonymousId: this.anonymousID,
        },
        scopes: scopes.split(' '),
        fetch,
      })
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey,
    });
  }

  private getPasswordFlowApi(credentials: UserAuthOptions) {
    const client = this.client
      .withPasswordFlow({
        host: authHost,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
          user: credentials,
        },
        scopes: scopes.split(' '),
        fetch,
      })
      .withHttpMiddleware(httpMiddlewareOptions)
      .build();

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey,
    });
  }

  public changeToPasswordFlow(credentials: UserAuthOptions) {
    this.request = this.getPasswordFlowApi(credentials);
  }

  public changeToAnonymousFlow() {
    this.anonymousID = uuidv4();
    this.request = this.getAnonymousFlowApi();
  }
}

export const api = new CreateApi();
