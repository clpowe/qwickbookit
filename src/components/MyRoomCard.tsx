import { component$ } from "@builder.io/qwik";
import { globalAction$ } from "@builder.io/qwik-city";
import type { Room } from "@/types/RoomTypes";
import { LuEye, LuTrash } from "@qwikest/icons/lucide";
import { createSessionClient } from "@/config/appwrite";
import { Query } from "node-appwrite";
import { catchError } from "@/library/utils";

interface MyRoomCardProps {
  room: Room;
}

export const useDeleteRoom = globalAction$(
  async (roomData, { redirect, cookie }) => {
    const session = cookie.get("appwrite-session");
    if (!session) {
      throw redirect(308, "/login");
    }

    const [error, data] = await catchError(createSessionClient(session.value));
    if (error) {
      throw redirect(302, "/error");
    }

    const user = await data.account.get();
    const userId = user.$id;

    const { documents: rooms } = await data.databases.listDocuments(
      import.meta.env.PUBLIC_APPWRITE_DATABASE,
      import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
      [Query.equal("user_id", userId)],
    );

    const roomToDelete = rooms.find((room) => room.$id === roomData.roomId);

    try {
      if (roomToDelete) {
        await data.databases.deleteDocument(
          import.meta.env.PUBLIC_APPWRITE_DATABASE,
          import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
          roomToDelete.$id,
        );
        return {
          success: true,
        };
      } else {
        return {
          error: "Room not found",
        };
      }
    } catch (err) {
      return {
        error: err.message,
      };
    }
  },
);

export default component$<MyRoomCardProps>(({ room }) => {
  const action = useDeleteRoom();

  return (
    <div class="mt-4 flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow sm:flex-row">
      <div class="flex flex-col">
        <h4 class="text-lg font-semibold">{room.name}</h4>
      </div>
      <div class="mt-2 flex w-full flex-col sm:mt-0 sm:w-auto sm:flex-row sm:space-x-2">
        <a
          href={`/rooms/${room.$id}`}
          class="mb-2 w-full rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-700 sm:mb-0 sm:w-auto"
        >
          <LuEye class="mr-1 inline"></LuEye> View Room
        </a>

        <button
          onClick$={async () => {
            const confirm = window.confirm(
              "Are you sure you want to delete this room?",
            );
            if (confirm) {
              const [error, data] = await catchError(
                action.submit({ roomId: room.$id }),
              );
              if (error) {
                console.error("Failed to delete room", error);
              }
              console.log("success");
            }
          }}
          class="mb-2 w-full rounded bg-red-500 px-4 py-2 text-center text-white hover:bg-red-700 sm:mb-0 sm:w-auto"
        >
          <LuTrash class="mr-1 inline" /> Delete
        </button>
      </div>
    </div>
  );
});
