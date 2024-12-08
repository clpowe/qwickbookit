import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { loadSessionFromCookie } from "@/routes/index";

export const onRequest: RequestHandler = async ({ next, redirect, cookie }) => {
  const { isAuthenticated } = await loadSessionFromCookie(cookie);
  if (!isAuthenticated) {
    throw redirect(308, "/login");
  }
  await next();
};

export default component$(() => {
  return (
    <>
      <h1>My Rooms</h1>
    </>
  );
});
