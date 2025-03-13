import * as React from "react"
import { Link } from "gatsby"
import { ThemeToggler } from "./themeToggler"

const Layout = ({
  location,
  title,
  children,
}: {
  location: unknown
  title?: string | null
  children: React.ReactNode
}) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
        <ThemeToggler />
      </h1>
    )
  } else {
    header = (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link className="header-link-home" to="/">
          {title}
        </Link>
        <ThemeToggler />
      </div>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer></footer>
    </div>
  )
}

export default Layout
