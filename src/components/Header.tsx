import { component$, useContext, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import Logo from "./assets/images/logo.svg";
import { LuBuilding, LuLogIn, LuLogOut, LuUser } from "@qwikest/icons/lucide";

import { AuthContext } from "~/root";
import { Image } from "@unpic/qwik";

export default component$(() => {
  const isAuthenticated = useContext(AuthContext);

  const handleLogout = $(async () => {});

  return (
    <header class="bg-gray-100">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <Link href="/">
              <Image
                src={Logo}
                class="h-12 w-12"
                alt="Bookit"
                priority={true}
              />
            </Link>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  class="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Rooms
                </Link>
                {/* <!-- Logged In Only --> */}
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/bookings"
                      class="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/rooms/add"
                      class="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Add Room
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* <!-- Right Side Menu -->*/}
          <div class="ml-auto">
            <div class="ml-4 flex items-center md:ml-6">
              {/* <!-- Profile Dropdown --> */}
              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    class="mr-3 flex items-center gap-1 text-gray-800 hover:text-gray-600"
                  >
                    <LuLogIn class="mr-1 inline" /> Login
                  </Link>
                  <Link
                    href="/register"
                    class="mr-3 flex items-center gap-1 text-gray-800 hover:text-gray-600"
                  >
                    <LuUser /> Register
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    href="/rooms/my"
                    class="mr-3 flex items-center gap-1 text-gray-800 hover:text-gray-600"
                  >
                    <LuBuilding /> My Rooms
                  </Link>
                  <button
                    onClick$={handleLogout}
                    class="mx-3 flex items-center gap-1 text-gray-800 hover:text-gray-600"
                  >
                    <LuLogOut /> Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/*<!-- Mobile menu -->*/}
      <div class="md:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <Link
            href="/"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Rooms
          </Link>
          {/*<!-- Logged In Only -->*/}
          {isAuthenticated && (
            <>
              <Link
                href="/bookings"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
              >
                Bookings
              </Link>
              <Link
                href="/rooms/add"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
              >
                Add Room
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});
