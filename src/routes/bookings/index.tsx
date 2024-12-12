import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Heading from "@/components/Heading";
import BookedRoomCard from "@/components/BookedRoomCard";
import { Query } from "node-appwrite";
import type {} from "@/types/RoomTypes";

import { loadSessionFromCookie } from "@/routes/index";
import { catchError } from "@/library/utils";
import { createSessionClient } from "@/config/appwrite";

export const onRequest: RequestHandler = async ({ next, redirect, cookie }) => {
  const { isAuthenticated } = await loadSessionFromCookie(cookie);
  if (!isAuthenticated) {
    throw redirect(302, "/login");
  }
  await next();
};

export const useBookings = routeLoader$(async ({ redirect, cookie }) => {
  const sessionCookie = cookie.get("appwrite-session");

  if (!sessionCookie) {
    throw redirect(302, "/login");
  }
  const { databases } = await createSessionClient(sessionCookie.value);

  const [error, userSession] = await catchError(loadSessionFromCookie(cookie));
  if (error || !userSession.user) {
    throw redirect(302, "/login");
  }

  const [error2, data] = await catchError(
    databases.listDocuments(
      import.meta.env.PUBLIC_APPWRITE_DATABASE,
      import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_BOOKINGS,
      [Query.equal("user_id", userSession.user.id)],
    ),
  );
  if (error2) {
    console.log("Error loading bookings", error2);
    return {
      error: "Error loading bookings",
    };
  }

  return data.documents;
});

export default component$(() => {
  const bookings = useBookings();

  if (bookings.value.error) {
    return <p>{bookings.value.error}</p>;
  }

  return (
    <>
      <Heading title="My Bookings" />
      {bookings.value.length === 0 ? (
        <p class="mt-4 text-gray-600">You have no bookings</p>
      ) : (
        bookings.value.map((booking) => (
          <BookedRoomCard booking={booking} key={booking.$id} />
        ))
      )}
    </>
  );
});
