import React from "react";
export const ThemeContext = React.createContext("light");
export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}
