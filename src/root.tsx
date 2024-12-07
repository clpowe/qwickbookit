import {
  component$,
  useContextProvider,
  useStore,
  createContextId,
  useTask$,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
  type RequestHandler,
  type Cookie,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik/build";
import { catchError } from "@/library/utils";
import { createSessionClient } from "@/config/appwrite";
import type { UserSession } from "@/types/UserTypes";

import "./global.css";

export const onRequest: RequestHandler = async ({
  next,
  url,
  redirect,
  cookie,
}) => {
  const { isAuthenticated } = await loadSessionFromCookie(cookie);
  if (!isAuthenticated) {
    console.log("You shouldnt be here");
    throw redirect(308, "/login");
  }

  await next();
};

async function loadSessionFromCookie(cookie: Cookie): Promise<UserSession> {
  const session = cookie.get("appwrite-session");
  if (!session) {
    return {
      isAuthenticated: false,
    };
  }

  const [error, account] = await catchError(createSessionClient(session.value));
  if (error) {
    return {
      isAuthenticated: false,
    };
  }

  const user = await account.account.get();

  return {
    isAuthenticated: true,
    user: {
      id: user.$id,
      name: user.name,
      email: user.email,
    },
  };
}

export const UserSessionContext = createContextId<UserSession>("user-session");

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  const userSession: UserSession = useStore({
    isAuthenticated: false,
  });

  // Pass State to children via context
  useContextProvider(UserSessionContext, userSession);

  useTask$(async () => {});

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
