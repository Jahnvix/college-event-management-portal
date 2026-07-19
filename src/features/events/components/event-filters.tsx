import Link from "next/link";
import { Search, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = Readonly<{
  category?: string | undefined;
  q?: string | undefined;
  venue?: string | undefined;
  date?: string | undefined;
}>;

const categories = [
  "TECHNICAL",
  "CULTURAL",
  "SPORTS",
  "WORKSHOP",
  "SEMINAR",
  "HACKATHON",
  "CAREER",
  "SOCIAL",
  "OTHER",
];

export function EventFilters({
  category,
  q,
  venue,
  date,
}: Props) {
  return (
    <form
      method="GET"
      className="mt-8 rounded-2xl border border-border bg-background-elevated p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search events..."
          aria-label="Search events"
        />

        <select
          name="category"
          defaultValue={category}
          aria-label="Category"
          className="h-11 rounded-xl border border-border bg-background-elevated px-3 text-sm"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0) + item.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <Input
          name="venue"
          defaultValue={venue}
          placeholder="Venue city"
          aria-label="Venue city"
        />

        <Input
          type="date"
          name="date"
          defaultValue={date}
          aria-label="Event date"
        />

        <div className="flex gap-2">
          <Button className="flex-1" type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>

          <Button variant="outline" type="button" asChild>
            <Link href="/events">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
}