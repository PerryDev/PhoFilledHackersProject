import { Bell, ChevronDown, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-primary/20 bg-primary px-4 py-3 sm:px-6 lg:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/40" />
          <input
            type="text"
            placeholder="Search students, schools..."
            className="w-full rounded-xl border border-white/15 bg-white/10 py-2 pl-10 pr-4 text-[13px] text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/60"
          />
        </div>
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <button className="relative rounded-xl p-2 hover:bg-white/10" aria-label="Notifications">
            <Bell className="h-5 w-5 text-primary-foreground/70" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-primary" />
          </button>
          <div className="flex items-center gap-2 border-l border-white/15 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              TL
            </div>
            <div>
              <p className="text-[13px] font-semibold text-primary-foreground">Thanh Le</p>
              <p className="text-[11px] text-primary-foreground/50">Senior Counselor</p>
            </div>
            <ChevronDown className="ml-1 h-4 w-4 text-primary-foreground/50" />
          </div>
        </div>
      </div>
    </header>
  );
}
