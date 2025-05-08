import { useEffect } from "react";
import {
  AlertRegular,
  DismissRegular,
  SearchRegular,
} from "@fluentui/react-icons";

interface NavProps {
  searchTerm: string;

  onSearchChange: (term: string) => void;
}

const Navbar = ({ searchTerm, onSearchChange }: NavProps) => {
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navbar.offsetHeight}px`
        );
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);
  return (
    <nav
      id="navbar"
      className="w-full bg-blue-700 py-2 px-8 flex justify-between items-center text-white"
    >
      <h3 className="text-xl">Onlook</h3>
      <div className="relative">
        <SearchRegular
          fontSize={20}
          className="absolute top-1/2 -translate-y-1/2 left-2 text-black"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search To Do"
          className="w-72 py-1 px-8 border rounded-md text-sm text-black outline-none"
        />
        {searchTerm && (
          <button
            className="absolute top-1/2 -translate-y-1/2 right-2 text-black"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <DismissRegular fontSize={18} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <AlertRegular fontSize={20} />
        <div className="border border-white rounded-full px-1">TA</div>
      </div>
    </nav>
  );
};

export default Navbar;
