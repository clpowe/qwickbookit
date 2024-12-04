import { component$ } from "@builder.io/qwik";

interface HeadingProps {
  title: string;
}

export default component$<HeadingProps>((props) => {
  return (
    <section class="mb-5 bg-white px-4 py-4 shadow">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">
        {props.title}
      </h1>
    </section>
  );
});
