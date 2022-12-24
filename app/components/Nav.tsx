import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <h1>Quinoa Book Tracker</h1>
      <div>
        <Link to="/add" className="mr-5">
          Add Book
        </Link>
        <a href="https://airtable.com/invite/l?inviteId=invQ6JDJvvqWfFWSR&inviteToken=75da5768f0c24b857adbb6827e2a5fe66794c270ce0e27b7dc9ae1884e6a1c69&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts">
          Edit Books
        </a>
      </div>
    </nav>
  );
}
