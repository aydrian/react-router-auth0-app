import type { Route } from "./+types/login";
import { auth0Client } from "~/utils/auth0.server";
import { envServer } from "~/utils/env.server";

export async function loader({ request }: Route.LoaderArgs) {
  const response = new Response();
  const authorizationUrl = await auth0Client.startInteractiveLogin(
    {
      appState: { returnTo: envServer.APP_BASE_URL }
    },
    { request, response }
  );

  const headers = new Headers(response.headers);
  headers.set("Location", authorizationUrl.href);

  return new Response(null, { status: 302, headers });
}
