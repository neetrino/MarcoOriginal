"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CATALOG_DEFAULT_VIEW_MODE,
  CATALOG_VIEW_MODE_STORAGE_KEY,
  parseCatalogViewMode,
  type CatalogViewMode,
} from "@/features/products/ui/catalog-view-mode";

type CatalogViewModeContextValue = {
  mode: CatalogViewMode;
  setMode: (mode: CatalogViewMode) => void;
};

const CatalogViewModeContext = createContext<CatalogViewModeContextValue | null>(
  null,
);

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): CatalogViewMode {
  return parseCatalogViewMode(localStorage.getItem(CATALOG_VIEW_MODE_STORAGE_KEY));
}

function getServerSnapshot(): CatalogViewMode {
  return CATALOG_DEFAULT_VIEW_MODE;
}

function writeViewMode(next: CatalogViewMode): void {
  localStorage.setItem(CATALOG_VIEW_MODE_STORAGE_KEY, next);
  for (const listener of listeners) listener();
}

export function CatalogViewModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const setMode = useCallback((next: CatalogViewMode) => {
    writeViewMode(next);
  }, []);
  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <CatalogViewModeContext.Provider value={value}>
      {children}
    </CatalogViewModeContext.Provider>
  );
}

export function useCatalogViewMode(): CatalogViewModeContextValue {
  const value = useContext(CatalogViewModeContext);
  if (!value) {
    throw new Error("useCatalogViewMode requires CatalogViewModeProvider");
  }
  return value;
}

export function useOptionalCatalogViewMode(): CatalogViewModeContextValue | null {
  return useContext(CatalogViewModeContext);
}
