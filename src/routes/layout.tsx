import { component$, Slot, useContext, useTask$ } from "@builder.io/qwik";
import type { RequestHandler, Cookie } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "qwik-sonner";
import { catchError } from "@/library/utils";
import { createSessionClient } from "@/config/appwrite";
import type { UserSession } from "@/types/UserTypes";
import { UserSessionContext } from "@/root";

export { useLogout } from "@/shared/loaders";

export const useLoader = routeLoader$(({ cookie }) => {
  const session = loadSessionFromCookie(cookie);
  return session;
});

export async function loadSessionFromCookie(
  cookie: Cookie,
): Promise<UserSession> {
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

  const [error2, user] = await catchError(account.account.get());
  if (error2) {
    return {
      isAuthenticated: false,
    };
  }
  return {
    isAuthenticated: true,
    user: {
      id: user.$id,
      name: user.name,
      email: user.email,
    },
  };
}

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  const currSession = useLoader();
  const session = useContext(UserSessionContext);

  useTask$(({ track }) => {
    track(session);
    session.isAuthenticated = currSession.value.isAuthenticated;
  });

  return (
    <>
      <Header />
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Toaster position="top-right" richColors duration={10000} closeButton />
        <Slot />
      </main>
      <Footer />
    </>
  );
});
