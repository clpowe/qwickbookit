import { component$ } from "@builder.io/qwik";
import { zod$, z, Link, routeAction$, Form } from "@builder.io/qwik-city";
import { createAdminClient } from "@/config/appwrite";
import { catchError } from "@/library/utils";

export const useLogin = routeAction$(
  async (data, { cookie }) => {
    const email: string = data.email.toString();
    const password: string = data.password.toString();

    if (!email || !password) {
      return {
        error: "Please fill out all fields",
      };
    }

    const { account } = await createAdminClient();

    const [error, session] = await catchError(
      account.createEmailPasswordSession(email, password),
    );

    if (error) {
      return {
        error: error.message,
      };
    }

    cookie.set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
    };
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  }),
);

export default component$(() => {
  const action = useLogin();

  return (
    <div class="flex items-center justify-center">
      <div class="mt-20 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <Form action={action}>
          <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">
            Login
          </h2>
          {action.value?.error && (
            <p class="text-red-500">{action.value.error}</p>
          )}
          <div class="mb-4">
            <label for="email" class="mb-2 block font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full rounded border px-3 py-2"
            />
          </div>

          <div class="mb-6">
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

          <div class="flex flex-col gap-5">
            <button
              type="submit"
              class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Login
            </button>

            <p>
              No account?
              <Link href="/register" class="text-blue-500">
                Register
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
});
