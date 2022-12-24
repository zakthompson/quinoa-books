import { useLoaderData } from "@remix-run/react";
import { getReading, getUnowned } from "../utils/airtable.server";
import type { Book } from "../utils/airtable.server";
import Nav from "../components/Nav";

export async function loader() {
  const reading = await getReading();
  const toBuy = await getUnowned();

  return {
    reading,
    toBuy,
  };
}

export default function Index() {
  const data = useLoaderData();

  return (
    <>
      <Nav />
      <main>
        <div>
          <h2>Currently Reading</h2>
          {data.reading.map((book: Book) => {
            const src = book.coverImage;
            if (src) {
              return <img key={book.name} src={src} alt="" />;
            }
            return <div key={book.name}>{book.name}</div>;
          })}
        </div>
        <div>
          <h2>Books to Buy</h2>
          {data.toBuy.map((book: Book) => {
            const src = book.coverImage;
            if (src) {
              return <img key={book.name} src={src} alt="" />;
            }
            return <div key={book.name}>{book.name}</div>;
          })}
        </div>
      </main>
    </>
  );
}
