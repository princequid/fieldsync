import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-600 transition-[background-color,border-color] duration-150 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        {isLight ? (
          <Moon size={18} strokeWidth={2} />
        ) : (
          <Sun size={18} strokeWidth={2} />
        )}
      </button>
      <span
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900 px-2 py-0.5 text-[11px] text-white opacity-0 transition-opacity delay-300 duration-150 group-hover:opacity-100 dark:bg-gray-700"
        role="tooltip"
      >
        {isLight ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </div>
  );
}
