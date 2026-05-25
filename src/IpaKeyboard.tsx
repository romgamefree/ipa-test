import { useState } from "react";
import { ArrowLeft, ArrowRight, Delete, ChevronDown, ChevronUp, Keyboard } from "lucide-react";
import { IPA_KEYS, IPA_TABS, type IpaTab } from "./ipa-data";
import { cn } from "./lib/utils";

interface Props {
  onInsert: (s: string) => void;
  onMove: (dir: -1 | 1) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function IpaKeyboard({
  onInsert,
  onMove,
  onBackspace,
  onClear,
  onSpace,
  collapsed,
  setCollapsed,
}: Props) {
  const [tab, setTab] = useState<IpaTab>("All");

  // Prevent buttons from stealing focus from the textarea
  const noFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <section className="rounded-2xl border bg-card shadow-[var(--shadow-card)] overflow-hidden">
      {/* drag handle / collapse bar */}
      <div className="flex justify-center pt-2">
        <button
          onMouseDown={noFocus}
          onClick={() => setCollapsed(!collapsed)}
          className="h-1.5 w-12 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60 transition"
          aria-label="Toggle keyboard"
        />
      </div>

      {/* tab row */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 overflow-x-auto">
        <div className="flex gap-1.5 flex-1">
          {IPA_TABS.map((t) => (
            <button
              key={t}
              onMouseDown={noFocus}
              onClick={() => setTab(t)}
              className={cn(
                "px-3.5 h-9 rounded-full text-sm font-medium whitespace-nowrap transition",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onMouseDown={noFocus}
          onClick={() => setCollapsed(!collapsed)}
          className="h-9 w-9 grid place-items-center rounded-full hover:bg-accent text-muted-foreground"
          aria-label="Collapse"
        >
          {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            {/* key grid */}
            <div className="flex flex-wrap gap-1.5 content-start">
              {IPA_KEYS[tab].map((k) => (
                <button
                  key={k}
                  onMouseDown={noFocus}
                  onClick={() => onInsert(k)}
                  className="h-12 min-w-12 px-3 rounded-xl bg-key text-key-foreground font-ipa text-xl hover:bg-key-hover shadow-[var(--shadow-key)] active:scale-[0.97] transition"
                  style={{ fontFamily: "var(--font-ipa)" }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* nav keys */}
            <div className="flex flex-col gap-1.5">
              <KeyBtn onMouseDown={noFocus} onClick={() => onMove(-1)} aria="Left">
                <ArrowLeft className="h-4 w-4" />
              </KeyBtn>
              <KeyBtn onMouseDown={noFocus} onClick={() => onMove(1)} aria="Right">
                <ArrowRight className="h-4 w-4" />
              </KeyBtn>
              <KeyBtn onMouseDown={noFocus} onClick={onBackspace} aria="Backspace">
                <Delete className="h-4 w-4" />
              </KeyBtn>
            </div>
          </div>

          {/* bottom function row */}
          <div className="mt-2 grid grid-cols-[auto_1fr_auto] gap-1.5">
            <button
              onMouseDown={noFocus}
              onClick={onClear}
              className="h-12 px-5 rounded-xl bg-key text-key-foreground font-medium hover:bg-key-hover shadow-[var(--shadow-key)] transition"
            >
              Clear
            </button>
            <button
              onMouseDown={noFocus}
              onClick={onSpace}
              className="h-12 rounded-xl bg-key text-key-foreground font-medium hover:bg-key-hover shadow-[var(--shadow-key)] transition"
            >
              Space
            </button>
            <button
              onMouseDown={noFocus}
              onClick={() => setCollapsed(true)}
              className="h-12 px-4 rounded-xl bg-key text-key-foreground font-medium hover:bg-key-hover shadow-[var(--shadow-key)] transition flex items-center gap-2"
            >
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline">Hide keyboard</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function KeyBtn({
  children,
  onClick,
  onMouseDown,
  aria,
}: {
  children: React.ReactNode;
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  aria: string;
}) {
  return (
    <button
      aria-label={aria}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className="h-12 w-12 grid place-items-center rounded-xl bg-key text-key-foreground hover:bg-key-hover shadow-[var(--shadow-key)] active:scale-[0.97] transition"
    >
      {children}
    </button>
  );
}
