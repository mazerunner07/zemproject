import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CloseButton({
  href,
  parent = "inventory",
}: {
  href: string;
  parent?: string;
}) {
  return (
    <Button type="button" className="dark:hover:bg-red-400 dark:bg-red-500" variant="outline" asChild>
      <Link
        href={
          parent === "" ? `/dashboard${href}` : `/dashboard/${parent}${href}`
        }
      >
        Close
      </Link>
    </Button>
  );
}
