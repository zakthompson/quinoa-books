import Airtable from "airtable";
import { coverKeyToSrc } from "./openlibrary";

// Airtable setup
let airtableBase: Airtable.Base | undefined;

declare global {
  var __airtableBase: Airtable.Base | undefined;
}

if (process.env.NODE_ENV === "production") {
  airtableBase = new Airtable().base(process.env.AIRTABLE_BASE || "");
} else {
  if (!global.__airtableBase) {
    global.__airtableBase = new Airtable().base(
      process.env.AIRTABLE_BASE || ""
    );
  }
  airtableBase = global.__airtableBase;
}

// Types
export interface Book {
  name: string;
  author: string;
  description: string;
  coverImage?: string;
  openLibraryKey?: string;
  openLibraryCoverKey?: number;
  genre?: string;
}

// Map Airtable records to Books
function recordToBook(record: Airtable.Record<Airtable.FieldSet>) {
  return {
    name: record.get("Name"),
    coverImage: (record.get("Cover Image") as Airtable.Attachment[])?.[0]
      ?.thumbnails?.large?.url,
  };
}

// Getters
export function getReading() {
  const table = airtableBase?.("Books");

  if (!table) return [];

  return new Promise((resolve, reject) => {
    table
      .select({
        maxRecords: 8,
        view: "Grid view",
        fields: ["Name", "Cover Image"],
        filterByFormula:
          "AND(NOT({Started Reading} = ''), {Finished Reading} = '')",
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          return reject([]);
        }

        resolve(records?.map(recordToBook) ?? []);
      });
  });
}

export function getUnowned() {
  const table = airtableBase?.("Books");

  if (!table) return [];

  return new Promise((resolve, reject) => {
    table
      .select({
        // maxRecords: 8,
        view: "Grid view",
        fields: ["Name", "Cover Image"],
        filterByFormula: "{Owned} = FALSE()",
      })
      .firstPage((err, records) => {
        if (err) {
          console.error(err);
          return reject([]);
        }

        resolve(records?.map(recordToBook) ?? []);
      });
  });
}

// Setters
export function addBook(book: Book) {
  const table = airtableBase?.("Books");

  if (!table) return [];

  return new Promise((resolve, reject) => {
    table.create(
      [
        {
          fields: {
            Name: book.name,
            Author: book.author,
            // Description: book.description,
            Genre: book.genre,
            Owned: false,
            "Cover Image": book.openLibraryCoverKey
              ? [
                {
                  url: coverKeyToSrc(book.openLibraryCoverKey, "L"),
                },
              ]
              : undefined,
          },
        },
      ],
      { typecast: true },
      function (err: unknown, records: Airtable.Record<Airtable.FieldSet>[]) {
        if (err) {
          console.error(err);
          reject([]);
        }

        resolve(records);
      }
    );
  });
}
