import lightModeIcon from "../images/light-mode.svg"
import darkModeIcon from "../images/dark-mode.svg"
import React from "react"

export const ThemeToggler = () => {
  const [currentTheme, setCurrentTheme] = React.useState(
    (localStorage.getItem("theme") as "light" | "dark" | null) || "dark"
  )

  const setLightMode = React.useCallback(() => {
    setCurrentTheme("light")
  }, [])
  const setDarkMode = React.useCallback(() => {
    setCurrentTheme("dark")
  }, [])

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme)
  }, [currentTheme])

  return (
    <div className="theme-switch-wrapper">
      {currentTheme === "dark" ? (
        <img src={lightModeIcon} onClick={setLightMode} role="button" />
      ) : (
        <img src={darkModeIcon} onClick={setDarkMode} role="button" />
      )}
    </div>
  )
}
