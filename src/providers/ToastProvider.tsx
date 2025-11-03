import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", durationMs = 3000) => {
    // Coerce non-string messages (objects/errors) to readable string
    const text = typeof message === "string" ? message : JSON.stringify(message);
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: text, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2 items-end w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto min-w-64 max-w-sm rounded-md border pl-4 pr-8 py-3 shadow-md relative " +
              (t.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : t.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-slate-50 border-slate-200 text-slate-800")
            }
            role="status"
            aria-live="polite"
          >
            {t.message}
            <button
              aria-label="Close"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-inherit/80 hover:text-inherit"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


