import { routeAction$ } from "@builder.io/qwik-city";
import { createSessionClient } from "@/config/appwrite";
import { catchError } from "@/library/utils";
// eslint-disable-next-line qwik/loader-location
export const useLogout = routeAction$(async (data, { cookie }) => {
  const session = cookie.get("appwrite-session");

  if (!session) {
    return {
      error: "No session cookie found",
    };
  }

  const { account } = await createSessionClient(session.value);

  const [error] = await catchError(account.deleteSession("current"));

  if (error) {
    console.error(error);
    return {
      success: false,
      error: "Error deleting session",
    };
  }

  cookie.delete("appwrite-session");

  return {
    success: true,
  };
});
