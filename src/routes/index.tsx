import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { createAdminClient } from "../config/appwrite";
import Heading from "../components/Heading";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types/RoomTypes";

export const useGetAllRooms = routeLoader$(async (requestEvent) => {
  const { databases } = await createAdminClient();

  const { documents: rooms } = await databases.listDocuments(
    import.meta.env.PUBLIC_APPWRITE_DATABASE,
    import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
  );

  if (!rooms) {
    return requestEvent.fail(404, {
      errorMessage: "Failed to get rooms",
    });
  }

  return rooms as Room[];
});

export default component$(() => {
  const rooms = useGetAllRooms();
  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.value.length > 0 ? (
        rooms.value.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>No rooms available at this time.</p>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
