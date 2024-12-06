import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { createAdminClient } from "@/config/appwrite";
import Heading from "@/components/Heading";
import BookingForm from "@/components/BookingForm";

import { LuChevronLeft } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import type { Room } from "@/types/RoomTypes";

export const useGetSingleRoom = routeLoader$(async (requestEvent) => {
  const { databases } = await createAdminClient();

  // Fetch all rooms
  const room = await databases.getDocument(
    import.meta.env.PUBLIC_APPWRITE_DATABASE,
    import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
    requestEvent.params.id,
  );

  if (!room) {
    return requestEvent.fail(404, {
      errorMessage: "Room not found",
    });
  }

  return room as Room;
});

export default component$(() => {
  const room = useGetSingleRoom();

  if (room.value.errorMessage) {
    return <Heading title="Room not found" />;
  }

  const bucketId = process.env.PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectId = process.env.PUBLIC_APPWRITE_PROJECT;

  const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${room.value.image}/view?project=${projectId}`;

  const imageSrc = room.value.image
    ? imageUrl
    : "./../../assets/images/no-image.jpeg";

  return (
    <>
      <Heading title={room.value.name!} />
      <div class="rounded-lg bg-white p-6 shadow">
        <Link
          href="/"
          class="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <LuChevronLeft class="mr-1 inline" />
          <span class="ml-2">Back to Rooms</span>
        </Link>

        <div class="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            layout="height"
            src={imageSrc}
            alt={room.value.name}
            width={400}
            height={100}
            class="h-64 w-full rounded-lg object-cover sm:w-1/3"
          />

          <div class="mt-4 sm:mt-0 sm:flex-1">
            <p class="mb-4 text-gray-600">{room.value.description}</p>

            <ul class="space-y-2">
              <li>
                <span class="font-semibold text-gray-800">Size:</span>{" "}
                {room.value.sqft} sq ft
              </li>
              <li>
                <span class="font-semibold text-gray-800">Availability:</span>
                {room.value.availability}{" "}
              </li>
              <li>
                <span class="font-semibold text-gray-800">Price:</span>$
                {room.value.price_per_hour}/hour
              </li>
              <li>
                <span class="font-semibold text-gray-800">Address:</span> 555
                {room.value.address}
              </li>
            </ul>
          </div>
        </div>

        <BookingForm room={room} />
      </div>
    </>
  );
});
