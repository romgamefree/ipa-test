import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isPractice = location.pathname === "/practice";

  return (
    <header className="w-full border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        
        {/* LEFT - LOGO */}
        <Link to="/" className="font-bold text-lg">
          IPA Trainer
        </Link>

        {/* NAV */}
        <nav className="flex gap-2">
          <Link
            to="/"
            className={`
              px-4 py-2 rounded-xl text-sm transition
              ${isHome
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
            `}
          >
            Trainer
          </Link>

          <Link
            to="/practice"
            className={`
              px-4 py-2 rounded-xl text-sm transition
              ${isPractice
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
            `}
          >
            Practice
          </Link>
        </nav>
      </div>
    </header>
  );
}