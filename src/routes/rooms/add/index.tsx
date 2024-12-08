import { component$ } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Heading from "@/components/Heading";
import { ID } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { loadSessionFromCookie } from "@/routes/index";
import { catchError } from "@/library/utils";

export const onRequest: RequestHandler = async ({ next, redirect, cookie }) => {
  const { isAuthenticated } = await loadSessionFromCookie(cookie);
  if (!isAuthenticated) {
    throw redirect(308, "/login");
  }
  await next();
};

export const useCreateRoom = routeAction$(async (data, { cookie }) => {
  const { databases, storage } = await createAdminClient();

  const [error, { user }] = await catchError(loadSessionFromCookie(cookie));
  if (error) {
    return {
      error: error.message,
    };
  }

  if (!user) {
    return {
      error: "You must be logged in to create a room",
    };
  }

  let imageID;

  const image = data.image as unknown as File;
  if (image && image.size > 0 && image.name != "undefined") {
    const [error, result] = await catchError(
      storage.createFile("rooms", ID.unique(), image),
    );
    if (error) {
      console.log("Error uploading image", error);
      return {
        error: "Error uploading image",
      };
    }

    imageID = result.$id;

    const [error2, newRoom] = await catchError(
      databases.createDocument(
        import.meta.env.PUBLIC_APPWRITE_DATABASE,
        import.meta.env.PUBLIC_APPWRITE_COLLECTIONS_ROOMS,
        ID.unique(),
        {
          user_id: user.id,
          name: data.name,
          description: data.description,
          sqft: data.sqft,
          capacity: data.capacity,
          price_per_hour: data.price_per_hour,
          address: data.address,
          location: data.location,
          availability: data.availability,
          amenities: data.amenities,
          image: imageID,
        },
      ),
    );

    if (error2) {
      console.log("Error creating room", error2);
      return {
        error: "Error creating room",
      };
    }

    return {
      success: true,
      data: newRoom,
    };
  }
});

export default component$(() => {
  const formAction = useCreateRoom();

  return (
    <>
      <Heading title="Add a Room" />
      <div class="w-full rounded-lg bg-white p-6 shadow-lg">
        <Form action={formAction}>
          <div class="mb-4">
            <label for="name" class="mb-2 block font-bold text-gray-700">
              Room Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              class="w-full rounded border px-3 py-2"
              placeholder="Enter a name (Large Conference Room)"
              required
            />
          </div>

          <div class="mb-4">
            <label for="description" class="mb-2 block font-bold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              class="h-24 w-full rounded border px-3 py-2"
              placeholder="Enter a description for the room"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="sqft" class="mb-2 block font-bold text-gray-700">
              Square Feet
            </label>
            <input
              type="number"
              id="sqft"
              name="sqft"
              class="w-full rounded border px-3 py-2"
              placeholder="Enter room size in ft"
              required
            />
          </div>

          <div class="mb-4">
            <label for="capacity" class="mb-2 block font-bold text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              class="w-full rounded border px-3 py-2"
              placeholder="Number of people the room can hold"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="price_per_hour"
              class="mb-2 block font-bold text-gray-700"
            >
              Price Per Hour
            </label>
            <input
              type="number"
              id="price_per_hour"
              name="price_per_hour"
              class="w-full rounded border px-3 py-2"
              placeholder="Enter price per hour"
              required
            />
          </div>

          <div class="mb-4">
            <label for="address" class="mb-2 block font-bold text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              class="w-full rounded border px-3 py-2"
              placeholder="Enter full address"
              required
            />
          </div>

          <div class="mb-4">
            <label for="location" class="mb-2 block font-bold text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              class="w-full rounded border px-3 py-2"
              placeholder="Location (Building, Floor, Room)"
              required
            />
          </div>

          <div class="mb-4">
            <label
              for="availability"
              class="mb-2 block font-bold text-gray-700"
            >
              Availability
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              class="w-full rounded border px-3 py-2"
              placeholder="Availability (Monday - Friday, 9am - 5pm)"
              required
            />
          </div>

          <div class="mb-4">
            <label for="amenities" class="mb-2 block font-bold text-gray-700">
              Amenities
            </label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              class="w-full rounded border px-3 py-2"
              placeholder="Amenities CSV (projector, whiteboard, etc.)"
              required
            />
          </div>

          {/*<!-- Image Upload -->*/}
          <div class="mb-8">
            <label for="image" class="mb-2 block font-bold text-gray-700">
              Image
            </label>

            <input
              type="file"
              id="image"
              name="image"
              class="w-full rounded border px-3 py-2"
            />
          </div>

          <div class="flex flex-col gap-5">
            <button
              type="submit"
              class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </>
  );
});
