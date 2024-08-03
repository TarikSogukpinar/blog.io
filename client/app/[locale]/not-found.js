import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-gray-950">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page Not Found!
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          The page you were looking for was not found. Please try again.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="rounded-md bg-gray-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Dashboard
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-900">
            Home Page <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}