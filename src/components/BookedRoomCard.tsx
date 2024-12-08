import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(({ booking }) => {
  const { room_id: room } = booking;

  function formateDate(dateString: string) {
    const date = new Date(dateString);
    const options = { month: "short" };
    const month = date.toLocaleString("en-US", options, { timeZone: "UTC" });
    const day = date.getUTCDate();

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    };

    const time = date.toLocaleString("en-US", timeOptions);

    return `${month} ${day} at ${time}`;
  }

  return (
    <div class="mt-4 flex flex-col items-start justify-between rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center">
      <div>
        <h4 class="text-lg font-semibold">{room.name}</h4>
        <p class="text-sm text-gray-600">
          <strong>Check In: </strong>
          {formateDate(booking.check_in)}
        </p>
        <p class="text-sm text-gray-600">
          <strong>Check Out:</strong> {formateDate(booking.check_out)}
        </p>
      </div>
      <div class="mt-2 flex w-full flex-col sm:mt-0 sm:w-auto sm:flex-row sm:space-x-2">
        <Link
          href={`/rooms/${room.$id}`}
          class="mb-2 w-full rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-700 sm:mb-0 sm:w-auto"
        >
          View Room
        </Link>
        {/* <CancelBookingButton bookingId={booking.$id} /> */}
      </div>
    </div>
  );
});
