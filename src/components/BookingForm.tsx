import { component$ } from "@builder.io/qwik";
import type { Room } from "@/types/RoomTypes";
import { routeAction$, Form } from "@builder.io/qwik-city";

export const useBookRoom = routeAction$(async (requestEvent) => {});

export default component$(({ room }: { room: Room }) => {
  const action = useBookRoom();
  return (
    <div class="mt-6">
      <h2 class="text-xl font-bold">Book this Room</h2>
      <Form action={action} class="mt-4">
        <input type="hidden" name="room_id" value={room.$id} />
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              for="check_in_date"
              class="block text-sm font-medium text-gray-700"
            >
              Check-In Date
            </label>
            <input
              type="date"
              id="check_in_date"
              name="check_in_date"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              for="check_in_time"
              class="block text-sm font-medium text-gray-700"
            >
              Check-In Time
            </label>
            <input
              type="time"
              id="check_in_time"
              name="check_in_time"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              for="check_out_date"
              class="block text-sm font-medium text-gray-700"
            >
              Check-Out Date
            </label>
            <input
              type="date"
              id="check_out_date"
              name="check_out_date"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              for="check_out_time"
              class="block text-sm font-medium text-gray-700"
            >
              Check-Out Time
            </label>
            <input
              type="time"
              id="check_out_time"
              name="check_out_time"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          >
            Book Room
          </button>
        </div>
      </Form>
    </div>
  );
});
