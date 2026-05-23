"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
}

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
  placeholder: "Tìm kiếm...",
});

const PLACEHOLDERS: Record<string, string> = {
  "/dashboard/appointments": "Tìm lịch hẹn, khách hàng, KTV...",
  "/dashboard/customers": "Tìm theo tên, email, số điện thoại...",
  "/dashboard/workflows": "Tìm workflow...",
  "/dashboard": "Tìm lịch hẹn, khách hàng...",
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryRaw] = useState("");
  const pathname = usePathname();

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
  }, []);

  // Reset query when navigating to a new page
  // (handled inside the header via useEffect on pathname)

  const placeholder = PLACEHOLDERS[pathname] ?? "Tìm kiếm...";

  return (
    <SearchContext.Provider value={{ query, setQuery, placeholder }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
