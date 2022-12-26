import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <div className="absolute inset-0 bg-black/50" />
      <Link to="/">
        <h1 className="relative mb-4">Quinoa Books</h1>
      </Link>
      <div className="relative mt-4">
        <Link to="/add" className="mr-5 link">
          Add Book
        </Link>
        <a
          href="https://airtable.com/invite/l?inviteId=invQ6JDJvvqWfFWSR&inviteToken=75da5768f0c24b857adbb6827e2a5fe66794c270ce0e27b7dc9ae1884e6a1c69&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts"
          className="link"
        >
          Edit Books
        </a>
      </div>
    </nav>
  );
}
