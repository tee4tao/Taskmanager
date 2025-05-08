import { useEffect } from "react";
import { AlertRegular, SearchRegular } from "@fluentui/react-icons";

const Navbar = () => {
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
      <div className="search-container">
        <SearchRegular className="search-icon" />
        <input
          type="text"
          //   value={searchTerm}
          //   onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search To Do"
          className="search-input"
        />
        {/* {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <DismissRegular />
              </button>
            )} */}
      </div>
      <div className="flex items-center gap-4">
        <AlertRegular fontSize={20} />
        <div className="border border-white rounded-full px-1">TA</div>
      </div>
    </nav>
  );
};

export default Navbar;
