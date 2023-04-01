import Layout from "../components/layout"

import React from "react"
import Seo from "../components/seo"
import { ResumeSection, TextOrTextGroup } from "../resume/types"
import { RESUME_CONTENT } from "../resume/content"

const Block = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ paddingLeft: 6 }}>{children}</div>
}

const BASE_FONT_SIZE = 18

const getFontSizeFromLevel = (level: number) => {
  switch (level) {
    case 0:
      return 32
    case 1:
      return 28
    case 2:
      return 24
    case 3:
      return 22
    default:
      return 28
  }
}

const Section_ = ({
  children,
  title,
  level,
}: {
  children: React.ReactNode
  title: string
  level: number
}) => {
  return (
    <div>
      <div
        style={{
          fontSize: getFontSizeFromLevel(level),
          color: "#E23373",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
      <Block>
        <div>{children}</div>
      </Block>
    </div>
  )
}

const Text = ({ data }: { data: TextOrTextGroup }) => {
  return (
    <li style={{ padding: 0, margin: 0 }}>
      {typeof data === "string" ? (
        data
      ) : (
        <div>
          <li style={{ marginBottom: 4 }}>{data.text}</li>
          <ul style={{ paddingLeft: 10 }}>
            {data.subText.map((d, i) => (
              <Text key={i} data={d} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

const LINK_REGEX = /.*(\[.+\])(\(.+\)).*/

const doesTextContainLink = (input: string) => LINK_REGEX.test(input)

const parseLinks = (input: string) => {
  if (!doesTextContainLink(input)) return input

  const linkMatch = input.match(LINK_REGEX)
  if (!linkMatch) return input

  const linkText = linkMatch[1]
  const linkURL = linkMatch[2]

  const linkMarkup = <a href={linkURL}>{linkText}</a>

  return parseLinks(input.replace(LINK_REGEX, linkMarkup))
}

const Section = ({
  data,
  level = 0,
}: {
  data?: ResumeSection
  level?: number
}) => {
  if (!data) return null

  const { title, text, sections, subtitle } = data

  const nextLevel = level + 1
  return (
    <div>
      <div
        style={{
          fontSize: getFontSizeFromLevel(level),
          color: "#E23373",
          fontWeight: "bold",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>{title}</div>
        <div>{subtitle}</div>
      </div>

      {text && (
        <div style={{ paddingLeft: 5 }}>
          <ul style={{ paddingLeft: 10 }}>
            {text?.map((t, i) => (
              <Text data={t} key={i} />
            ))}
          </ul>
        </div>
      )}

      {sections?.map((section, key) => (
        <div style={{ paddingLeft: 5 }} key={key}>
          <Section data={section} level={nextLevel} />
        </div>
      ))}
    </div>
  )
}

const Resume = ({ location }: { location: Location }) => {
  return (
    <Layout title={"Resume"} location={location}>
      <Section data={RESUME_CONTENT} />
    </Layout>
  )
}

export const Head = () => <Seo title="Resume" />

export default Resume
