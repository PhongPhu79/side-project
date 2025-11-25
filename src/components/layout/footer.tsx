export function AppFooter() {
  return (
    <footer
      className="
        border-t border-slate-200 bg-slate-100 
        text-xs text-slate-500
        dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400
      "
    >
      <div className="container-app py-6 space-y-4">
        <p className="max-w-3xl text-[11px] leading-relaxed">
          Prices and availability may vary. Product information is for demo
          purposes only and does not represent a real store.
        </p>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              © {new Date().getFullYear()} MyStore. All rights reserved.
            </span>

            <span className="hidden h-3 w-px bg-slate-300 md:inline-block dark:bg-slate-700" />

            <div className="flex flex-wrap items-center gap-2">
              <button className="cursor-pointer hover:underline">
                Privacy Policy
              </button>
              <span className="text-[10px]">·</span>
              <button className="cursor-pointer hover:underline">
                Terms of Use
              </button>
              <span className="text-[10px]">·</span>
              <button className="cursor-pointer hover:underline">
                Sales & Refunds
              </button>
              <span className="text-[10px]">·</span>
              <button className="cursor-pointer hover:underline">Legal</button>
            </div>
          </div>
          <div className="flex items-center justify-start text-[11px] md:justify-end">
            <span className="mr-1.5 h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span>Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
