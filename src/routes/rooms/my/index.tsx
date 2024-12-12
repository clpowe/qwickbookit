import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { loadSessionFromCookie } from "@/routes/index";
import { createSessionClient } from "@/config/appwrite";
import { catchError } from "@/library/utils";
import { Query } from "node-appwrite";
import Heading from "@/components/Heading";
import MyRoomCard from "@/components/MyRoomCard";

export const onRequest: RequestHandler = async ({ next, redirect, cookie }) => {
  const { isAuthenticated } = await loadSessionFromCookie(cookie);
  if (!isAuthenticated) {
    throw redirect(308, "/login");
  }
  await next();
};

export const useGetMyRooms = routeLoader$(async ({ redirect, cookie }) => {
  const sessionCookie = cookie.get("appwrite-session");

  if (!sessionCookie) {
    throw redirect(302, "/login");
  }

  const [error, data] = await catchError(
    createSessionClient(sessionCookie.value),
  );
  if (error) {
    throw redirect(302, "/error");
  }
  // Get user ID
  const user = await data.account.get();
  const userId = user.$id;

  // Fetch users rooms
  const { documents: rooms } = await data.databases.listDocuments(
    import.meta.env.PUBLIC_APPWRITE_DATABASE,
    import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
    [Query.equal("user_id", userId)],
  );

  return rooms;
});

export default component$(() => {
  const rooms = useGetMyRooms();

  console.log(rooms);

  return (
    <>
      <Heading title="My Rooms" />
      {rooms.value.length > 0 ? (
        rooms.value.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
        <p>No rooms found</p>
      )}
    </>
  );
});
