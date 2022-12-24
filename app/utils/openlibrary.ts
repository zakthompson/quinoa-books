import type { Book } from "./airtable.server";

// Types
export interface OpenLibraryBook {
  key: string;
  title: string;
  description: string;
  cover_i: number;
  covers: number[];
  authors: { author: { key: string } }[];
  subjects: string[];
}

export interface OpenLibraryAuthor {
  name: string;
}

// Converters
function openLibraryDocToBook(doc: OpenLibraryBook, author: string): Book {
  return {
    name: doc.title,
    author,
    description: doc.description,
    openLibraryKey: doc.key,
    openLibraryCoverKey: doc.cover_i ?? doc.covers?.[0],
    genre: doc.subjects?.slice(0,3).join(', '),
  };
}

function openLibraryAuthorToString(author: OpenLibraryAuthor) {
  return author.name;
}

export function coverKeyToSrc(key: number, size = "M") {
  return `https://covers.openlibrary.org/b/id/${key}-${size}.jpg`;
}

// Getters
export async function search(query: string) {
  const res = await fetch(
    `http://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  return data.docs.map(openLibraryDocToBook);
}

export async function getBook(key: string) {
  const res = await fetch(`https://openlibrary.org${key}.json`);
  const data = await res.json();

  const author = await getAuthor(data.authors[0]?.author?.key);

  return openLibraryDocToBook(data, author);
}

export async function getAuthor(key: string) {
  const res = await fetch(`https://openlibrary.org${key}.json`);
  const data = await res.json();
  return openLibraryAuthorToString(data);
}
