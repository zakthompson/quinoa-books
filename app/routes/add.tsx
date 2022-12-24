import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addBook } from "../utils/airtable.server";
import type { Book } from "../utils/airtable.server";
import { Form } from "@remix-run/react";
import Nav from "../components/Nav";
import { search, getBook, coverKeyToSrc } from "../utils/openlibrary";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const results = query ? await search(query) : [];
  return results;
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const intent = body.get("intent");
  switch (intent) {
    case "add":
      const newBook = await getBook(`${body.get("openLibraryKey")}`);
      await addBook(newBook);
      return null;
    default:
      return redirect(`?query=${body.get("query")}`);
  }
}

export default function Add() {
  const data = useLoaderData();

  return (
    <>
      <Nav />
      <main>
        <h2>Book Search</h2>
        <Form method="post" className="mb-4">
          <input type="search" name="query" />
          <button type="submit" name="intent" value="search" className="ml-2">
            Search
          </button>
        </Form>
        <div className="flex flex-wrap gap-4">
          {data.map((book: Book, index: number) => {
            const { openLibraryCoverKey } = book;
            const src = openLibraryCoverKey
              ? coverKeyToSrc(openLibraryCoverKey)
              : "";
            return (
              <Form
                className="relative group min-w-[180px]"
                method="post"
                key={index}
              >
                <input
                  type="hidden"
                  name="openLibraryKey"
                  value={book.openLibraryKey}
                />
                {src && <img src={src} alt="" />}
                {!src && (
                  <div className="w-[180px] h-[255px] border-gray-800 border p-2 flex items-center justify-center">
                    {book.name}
                  </div>
                )}
                <button
                  type="submit"
                  name="intent"
                  value="add"
                  className="hidden absolute inset-0 bg-white/90 group-hover:flex group-focus:flex items-center justify-center"
                >
                  <div className="rounded-full bg-green-500 h-10 w-10 flex items-center justify-center text-2xl">
                    +
                  </div>
                </button>
              </Form>
            );
          })}
        </div>
      </main>
    </>
  );
}
