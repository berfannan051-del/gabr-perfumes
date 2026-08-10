"use client";

import { useMemo, useState } from "react";
import { ChevronIcon, SearchIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";

export type DataTableColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "start" | "end";
};

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchText,
  searchPlaceholder,
  emptyLabel,
  pageSize = 10,
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  searchText?: (row: T) => string;
  searchPlaceholder?: string;
  emptyLabel: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchText || !query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => searchText(row).toLowerCase().includes(q));
  }, [rows, query, searchText]);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const list = [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filtered, sortKey, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(col: DataTableColumn<T>) {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("asc");
    }
  }

  return (
    <div>
      {searchText && (
        <div className="relative mb-4 max-w-sm">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="ps-10"
          />
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-body py-16 text-center text-muted-foreground">{emptyLabel}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-start">
              <thead>
                <tr className="border-b border-border text-label text-muted-foreground">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`py-3 font-normal ${col.align === "end" ? "text-end" : "text-start"}`}
                    >
                      {col.sortValue ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col)}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {col.label}
                          {sortKey === col.key && (
                            <ChevronIcon
                              className={`h-3 w-3 ${sortDir === "asc" ? "-rotate-90" : "rotate-90"}`}
                            />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={rowKey(row)} className="border-b border-border">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-3 text-body ${col.align === "end" ? "text-end" : "text-start"}`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-caption">
                {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} / {sorted.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="border border-border px-3 py-1.5 text-caption disabled:opacity-40"
                >
                  <ChevronIcon className="h-3 w-3 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="border border-border px-3 py-1.5 text-caption disabled:opacity-40"
                >
                  <ChevronIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
