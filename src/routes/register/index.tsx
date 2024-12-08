import { component$ } from "@builder.io/qwik";
import { zod$, z, Link, routeAction$, Form } from "@builder.io/qwik-city";
import { createAdminClient } from "@/config/appwrite";
import { catchError } from "@/library/utils";
import { ID } from "node-appwrite";

export const useRegister = routeAction$(
  async (data) => {
    const email = data.email.toString();
    const name = data.name.toString();
    const password = data.password.toString();
    const confirmPassword = data.passwordConfirm.toString();

    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match",
      };
    }

    const { account } = await createAdminClient();

    const [error, user] = await catchError(
      account.create(ID.unique(), email, password, name),
    );

    console.log(user);

    if (error) {
      return {
        error: "Could not create user",
      };
    }

    return {
      success: true,
    };
  },
  zod$({
    email: z.string().email(),
    name: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string(),
  }),
);

export default component$(() => {
  const action = useRegister();
  return (
    <div class="flex items-center justify-center">
      <div class="mt-20 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <Form action={action}>
          <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
            Register
          </h2>

          <div class="mb-4">
            <label for="name" class="mb-2 block font-bold text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              class="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="mb-2 block font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="password" class="mb-2 block font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div class="mb-6">
            <label
              for="passwordConfirm"
              class="mb-2 block font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              class="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div class="flex flex-col gap-5">
            <button
              type="submit"
              class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register
            </button>

            <p>
              Have an account?
              <Link href="/login" class="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
});
