import { json } from "@remix-run/node";
import type { MetaFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { isAuthorized } from "./utils/auth";

import styles from "./styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Quinoa Books",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  if (!isAuthorized(request)) {
    return json({ authorized: false }, { status: 401 });
  }

  return json({
    authorized: true,
  });
};

export default function App() {
  const data = useLoaderData();

  if (!data.authorized) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV !== "production" && (
          <script src="http://localhost:8097"></script>
        )}
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
