import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData, useTransition } from "@remix-run/react";
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
  const transition = useTransition();

  return (
    <>
      <Nav />
      <main className="text-center">
        <h1>Book Search</h1>
        <Form method="post" className="mb-4">
          <input type="search" name="query" placeholder="Enter book title" />
        </Form>
        <div className="book-grid justify-center m-auto">
          {data.map((book: Book, index: number) => {
            const { openLibraryCoverKey } = book;
            const src = openLibraryCoverKey
              ? coverKeyToSrc(openLibraryCoverKey)
              : "";
            return (
              <Form className="book relative group" method="post" key={index}>
                <input
                  type="hidden"
                  name="openLibraryKey"
                  value={book.openLibraryKey}
                />
                {src && <img src={src} alt="" />}
                {!src && <div className="missing-image">{book.name}</div>}
                <button
                  disabled={transition.state !== "idle"}
                  type="submit"
                  name="intent"
                  value="add"
                  className="hidden absolute inset-0 bg-white/90 group-hover:flex group-focus:flex items-center justify-center"
                >
                  {transition.state === "submitting" && <div>Adding...</div>}
                  {transition.state === "loading" && <div>Added!</div>}
                  {transition.state === "idle" && (
                    <div className="rounded-full bg-green-500 h-10 w-10 flex items-center justify-center text-2xl">
                      +
                    </div>
                  )}
                </button>
              </Form>
            );
          })}
        </div>
      </main>
    </>
  );
}
