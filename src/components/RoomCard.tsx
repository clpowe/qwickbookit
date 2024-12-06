import { component$ } from "@builder.io/qwik";
import { Image } from "@unpic/qwik";
import placeholder from "@/assets/images/no-image.jpeg";
import type { Room } from "@/types/RoomTypes";

const bucketId = import.meta.env.PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
const projectId = import.meta.env.PUBLIC_APPWRITE_PROJECT;

export default component$(({ room }: { room: Room }) => {
  const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${room.image}/view?project=${projectId}`;

  const imageSrc = room.image ? imageUrl : placeholder;
  return (
    <div class="mt-4 flex flex-col items-start justify-between rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center">
      <div class="flex flex-col sm:flex-row sm:space-x-4">
        <Image
          src={imageSrc}
          layout="height"
          width={400}
          height={400}
          alt={room.name}
          class="mb-3 w-full rounded-lg object-cover sm:mb-0 sm:h-32 sm:w-32"
        />
        <div class="space-y-1">
          <h4 class="text-lg font-semibold">{room.name}</h4>
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-800"> Address:</span> 555
            {room.address}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-800"> Availability:</span>
            {room.availability}
          </p>
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-gray-800"> Price:</span>
            {room.price_per_hour}/hour
          </p>
        </div>
      </div>
      <div class="mt-2 flex w-full flex-col sm:mt-0 sm:w-auto sm:flex-row sm:space-x-2">
        <a
          href={`/rooms/${room.$id}`}
          class="mb-2 w-full rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-700 sm:mb-0 sm:w-auto"
        >
          View Room
        </a>
      </div>
    </div>
  );
});
