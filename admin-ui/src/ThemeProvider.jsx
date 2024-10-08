// src/ThemeProvider.js
import React, { createContext, useContext, useState } from "react";
import { ConfigProvider } from "antd";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

// Define the light and dark themes
const themes = {
  light: {
    primaryColor: "#92B5FF", // Orange
    backgroundColor: "#ffffff", // White
    textColor: "#000000", // Black
    menuBackground: "#ffffff",
    menuHoverBackground: "#92B5FF",
    menuHoverColor: "#ffffff",
    menuSelectedBackground: "#2F6EBA",
    menuSelectedColor: "#ffffff",
  },
  dark: {
    primaryColor: "#1d3557", // Dark Blue
    backgroundColor: "#111d2c", // Dark Background
    textColor: "#ffffff", // White
    menuBackground: "#111d2c",
    menuHoverBackground: "#1a1a2e",
    menuHoverColor: "#00aaff",
    menuSelectedBackground: "#001f3f",
    menuSelectedColor: "#ffffff",
  },
};

// Create a context for the theme
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to light theme

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: currentTheme.primaryColor,
            colorBgBase: currentTheme.backgroundColor,
            colorTextBase: currentTheme.textColor,
          },
        }}
      >
        <StyledThemeProvider theme={currentTheme}>
          {children}
        </StyledThemeProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
