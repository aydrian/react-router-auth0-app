import {
  ServerClient,
  type StateData,
  type TransactionData
} from "@auth0/auth0-server-js";
import { createCookieSessionStorage } from "react-router";
import { ReactRouterTransactionStore } from "./react-router-transaction-store";
import { ReactRouterSessionStore } from "./react-router-session-store";
import { envServer } from "~/utils/env.server";

// export interface Auth0ReactRouterOptions {
//   domain: string;
//   clientId: string;
//   clientSecret: string;
//   appBaseUrl: string;
//   sessionSecret: string;
// }

const StateStorage = createCookieSessionStorage<StateData>({
  cookie: {
    name: "__a0_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: envServer.NODE_ENV === "production",
    secrets: [envServer.AUTH0_SECRET]
  }
});
const TransactionStorage = createCookieSessionStorage<TransactionData>({
  cookie: {
    name: "__a0_tx",
    httpOnly: envServer.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    secrets: [envServer.AUTH0_SECRET]
  }
});

const callbackPath = "/auth/callback";
const redirectUri = new URL(callbackPath, envServer.APP_BASE_URL);

export const auth0Client = new ServerClient({
  domain: envServer.AUTH0_DOMAIN,
  clientId: envServer.AUTH0_CLIENT_ID,
  clientSecret: envServer.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    redirect_uri: redirectUri.toString()
  },
  transactionStore: new ReactRouterTransactionStore(
    { secret: envServer.AUTH0_SECRET },
    TransactionStorage
  ),
  stateStore: new ReactRouterSessionStore(
    { secret: envServer.AUTH0_SECRET },
    StateStorage
  )
});

// export function auth0(options: Auth0ReactRouterOptions) {
//   const callbackPath = "/auth/callback";
//   const redirectUri = new URL(callbackPath, options.appBaseUrl);

//   const auth0Client = new ServerClient({
//     domain: options.domain,
//     clientId: options.clientId,
//     clientSecret: options.clientSecret,
//     authorizationParams: {
//       redirect_uri: redirectUri.toString()
//     },
//     transactionStore: new ReactRouterTransactionStore(
//       { secret: options.sessionSecret || "dev-secret" },
//       TransactionStorage
//     ),
//     stateStore: new ReactRouterSessionStore(
//       { secret: options.sessionSecret || "dev-secret" },
//       StateStorage
//     )
//   });

//   return auth0Client;
// }
