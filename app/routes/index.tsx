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
        <div className="mb-4">
          {!!data.reading.length && <h2>Currently Reading</h2>}
          <div className="book-grid">
            {data.reading.map((book: Book, index: number) => {
              const src = book.coverImage;
              return (
                <div className="book" key={index}>
                  {!!src && <img src={src} alt="" />}
                  {!src && <div className="missing-image">{book.name}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {!!data.toBuy.length && <h2>Books to Buy</h2>}
          <div className="book-grid">
            {data.toBuy.map((book: Book, index: number) => {
              const src = book.coverImage;
              return (
                <div className="book" key={index}>
                  {!!src && <img src={src} alt="" />}
                  {!src && <div className="missing-image">{book.name}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
