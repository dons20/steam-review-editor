import React from "react";
import { Sun, Moon } from "lucide-react";
import { useModalTheme } from "../../util/ThemeContext";
import classes from "./header.module.scss";

function Header() {
  const { modalTheme, toggleModalTheme } = useModalTheme();

  return (
    <header className={classes.main}>
      <div className={classes.title}>Steam Review Editor</div>
      <button
        className={classes.themeToggle}
        onClick={toggleModalTheme}
        aria-label={`Switch to ${modalTheme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${modalTheme === "dark" ? "light" : "dark"} mode`}
      >
        {modalTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        <span className={classes.themeLabel}>
          {modalTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    </header>
  );
}

export default Header;
