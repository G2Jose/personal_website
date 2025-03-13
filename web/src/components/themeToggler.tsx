import lightModeIcon from "../images/light-mode.svg"
import darkModeIcon from "../images/dark-mode.svg"
import React from "react"

const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme") as null | "dark" | "light"
    return storedTheme ? storedTheme : "dark"
  } catch {
    return "dark"
  }
}

const setStoredTheme = (theme: "light" | "dark") => {
  try {
    localStorage.setItem("theme", theme)
  } catch {
    //
  }
}

export const ThemeToggler = () => {
  const [currentTheme, setCurrentTheme] = React.useState(getStoredTheme())

  const setLightMode = React.useCallback(() => {
    setCurrentTheme("light")
  }, [])
  const setDarkMode = React.useCallback(() => {
    setCurrentTheme("dark")
  }, [])

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme)
    setStoredTheme(currentTheme)
  }, [currentTheme])

  console.log("currentTheme", currentTheme)

  return (
    <div className="theme-switch-wrapper">
      {currentTheme === "light" ? (
        <img
          src={darkModeIcon}
          onClick={setDarkMode}
          role="button"
          alt="set dark mode"
        />
      ) : (
        <img
          src={lightModeIcon}
          onClick={setLightMode}
          role="button"
          alt="set light mode"
        />
      )}
    </div>
  )
}
