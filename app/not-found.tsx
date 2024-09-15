import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="text-xs">
      Page Not Found!{" "}
      <Link href="/" className="text-blue-700 underline">
        Return home page
      </Link>
    </div>
  );
}
