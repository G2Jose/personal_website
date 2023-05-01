import Layout from "../components/layout"

import React from "react"
import Seo from "../components/seo"
import { PageProps, graphql } from "gatsby"
import { useWindowDimensions } from "../hooks/useWindowDimensions"

const Block = ({
  children,
  paddingLeft,
}: {
  children: React.ReactNode
  paddingLeft?: number
}) => {
  return <div style={{ paddingLeft: paddingLeft ?? 12 }}>{children}</div>
}

const H1 = ({ children }: { children: string }) => (
  <div style={{ color: "#E23373", fontSize: 32, fontWeight: "bold" }}>
    {children}
  </div>
)

const H2 = ({ children }: { children: string }) => (
  <div style={{ color: "#E23373", fontSize: 28, fontWeight: "bold" }}>
    {children}
  </div>
)

const H3 = ({ children }: { children: string }) => (
  <div style={{ color: "#E23373", fontSize: 24, fontWeight: "bold" }}>
    {children}
  </div>
)

const H4 = ({ children }: { children: string }) => (
  <div style={{ color: "#E23373", fontSize: 20, fontWeight: "bold" }}>
    {children}
  </div>
)

const List = ({ children }: { children: React.ReactNode }) => (
  <ul
    style={{ marginBottom: 16, marginTop: 0, marginLeft: 18, paddingLeft: 0 }}
  >
    {children}
  </ul>
)

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: 4 }}>{children}</li>
)

const Row = ({ children }: { children: React.ReactNode[] }) => {
  const dimensions = useWindowDimensions()

  return (
    <div
      style={{
        flexDirection: dimensions.isSmallDevice ? "column" : "row",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {children.map((child, i) => (
        <React.Fragment key={i}>{child}</React.Fragment>
      ))}
    </div>
  )
}

const Resume = ({
  location,
  data,
}: {
  location: Location
  data: PageProps<Queries.IndexPageQuery>["data"]
}) => {
  const siteTitle = data.site?.siteMetadata?.title || ""
  return (
    <Layout location={location} title={siteTitle}>
      <Block paddingLeft={0}>
        <H1>Summary</H1>
        <Block>
          <List>
            <ListItem>
              Product-minded engineering generalist with years of experience in
              various capacities – technical leadership, people, process &
              project management, hands-on software development
            </ListItem>
            <ListItem>
              Extensive experience leading teams and executing complex,
              open-ended projects in a startup and corporate environments
            </ListItem>
          </List>
        </Block>
      </Block>
      <Block paddingLeft={0}>
        <H1>Work Experience</H1>
        <Block>
          <H2>Drop Technologies Inc</H2>
          <Block>
            <Row>
              <H3>Senior Engineering Manager</H3>
              <H4>&apos;22 – present</H4>
            </Row>
            <List>
              <ListItem>
                Managed 2 high performing, full-stack product engineering teams
                and their roadmaps
              </ListItem>
            </List>
          </Block>

          <Block>
            <Row>
              <H3>Engineering Manager</H3>
              <H4>Core Team, &apos;19 – &apos;22</H4>
            </Row>
            <List>
              <ListItem>
                Managed a full stack product engineering team responsible for
                the mobile app’s core user experience; successfully scaled it
                into 2 distinct teams, each with their own areas of focus
              </ListItem>
              <ListItem>
                Worked with company leadership on translating company vision
                into objectives and key results
              </ListItem>
              <ListItem>
                Worked closely with product managers, engineers, data
                scientists, designers and cross functional business teams on
                identifying, prioritizing and executing impactful projects
              </ListItem>
              <ListItem>
                Provided technical leadership to the wider Drop engineering
                team, led several high impact, cross-team technical efforts
              </ListItem>
              <Block>
                <List>
                  <ListItem>
                    App Performance optimizations: Led a project that resulted
                    in a drastic improvement to app responsiveness on the iOS &
                    Android (react native) apps
                  </ListItem>
                  <ListItem>
                    CodePull: Built an internal system that allows anyone at
                    Drop to load up app changes from a pull request on their
                    device by simply clicking an automatically generated link
                  </ListItem>
                  <ListItem>
                    Test tooling: Built an internal framework that enables
                    engineers to easily write comprehensive app integration
                    tests leveraging realistic mock data
                  </ListItem>
                </List>
              </Block>
            </List>
          </Block>

          <Block>
            <Row>
              <H3>Engineering Lead</H3>
              <H4>Growth Team, &apos;18 – &apos;19</H4>
            </Row>
            <List>
              <ListItem>
                Led a full stack engineering team of 4 individuals focused on
                product goals including user acquisition, engagement and
                retention
              </ListItem>
              <ListItem>
                Led tooling, process and other infrastructure initiatives
                focused on increasing developer happiness, productivity and code
                quality
              </ListItem>

              <Block>
                <List>
                  <ListItem>
                    Typescript: made the case for, got buy-in and spearheaded
                    migration; built internal tooling to track its adoption and
                    assist with incremental migration; defined best practices
                    and internal constructs to effectively write typesafe code
                  </ListItem>
                  <ListItem>
                    Continuous Deployment: built tooling to continuously deploy
                    merged app code to a staging environment
                  </ListItem>
                  <ListItem>
                    Static code analysis: built internal rules for eslint &
                    rubocop; rules rely on AST analysis to flag certain types of
                    problematic code
                  </ListItem>
                </List>
              </Block>
            </List>
          </Block>

          <Block>
            <Row>
              <H3>Software Engineer</H3>
              <H4>Drop Engineering Team, &apos;18</H4>
            </Row>
            <List>
              <ListItem>
                Worked as one of the main primarily frontend-focused, full-stack
                software engineers building the Drop mobile app in react native
                + backend in ruby on rails
              </ListItem>
              <ListItem>
                Built and owned several impactful product domains including
                in-app shopping, referral program, card linking, marketing comms
                infrastructure, search, rewards etc
              </ListItem>
              <ListItem>
                Formalized and drove adoption of a regular app release process;
                also built tooling to enable anyone to quickly and safely
                release code
              </ListItem>
            </List>
          </Block>
        </Block>

        <Block>
          <H2>Deloitte</H2>
          <Block>
            <Row>
              <H3>Senior Consultant</H3>
              <H4>&apos;17 – &apos;18</H4>
            </Row>
            <List>
              <ListItem>
                Tech Lead, Ecommerce Security Enhancement Program – Leading
                Canadian Retailer
              </ListItem>
              <Block>
                <List>
                  <ListItem>
                    Led a project to enhance security across 4 ecommerce stores
                    owned by the retailer
                  </ListItem>
                </List>
              </Block>

              <ListItem>
                Tech Lead, Self Scan & Checkout Program – Loblaw Digital
              </ListItem>
              <Block>
                <List>
                  <ListItem>
                    Led a project to build an in-store mobile scan and checkout
                    experience
                  </ListItem>
                  <ListItem>
                    Led building a user facing Point of Sale system for
                    checkouts as well as the APIs integrating with the backend
                    system
                  </ListItem>
                </List>
              </Block>
            </List>
          </Block>

          <Block>
            <Row>
              <H3>Consultant</H3>
              <H4>&apos;16 – &apos;17</H4>
            </Row>
            <List>
              <ListItem>Solutions Engineer, PC Optimum</ListItem>
              <Block>
                <List>
                  <ListItem>
                    Frontend solution engineer on a net new web presence for
                    Canada’s largest loyalty program
                  </ListItem>
                </List>
              </Block>
            </List>
          </Block>

          <Block>
            <Row>
              <H3>Business Technology Analyst</H3>
              <H4>&apos;15 – &apos;16</H4>
            </Row>
            <List>
              <ListItem>
                Solutions Architect, Sonnet Insurance - Digital Transformation
                Program
              </ListItem>
              <Block>
                <List>
                  <ListItem>
                    Worked on solutions architecture team on a net new,
                    multi-phased Direct to Consumer insurance program
                  </ListItem>
                  <ListItem>
                    Worked across technical teams to ensure systems being built
                    were inter- operable, followed development best practices
                    and met security & performance requirements
                  </ListItem>
                </List>
              </Block>
            </List>
          </Block>
        </Block>
      </Block>

      <Block paddingLeft={0}>
        <H1>Personal Projects</H1>
        <Block>
          <List>
            <ListItem>
              <a href="https://ajournaladay.com/">A Journal A Day</a>
            </ListItem>
            <Block>
              <List>
                <ListItem>
                  A privacy focused, cross platform app for daily, secure,
                  journal entries
                </ListItem>
              </List>
            </Block>

            <ListItem>
              <a href="https://www.communautowatcher.com/">
                Communauto Watcher
              </a>
            </ListItem>
            <Block>
              <List>
                <ListItem>
                  A react native app that allows users to set a geographic area
                  to watch for and get notified when cars from a car share
                  service are available to rent
                </ListItem>
                <ListItem>
                  Powered by a backend server running in koa & prisma ORM for
                  postgres
                </ListItem>
              </List>
            </Block>

            <ListItem>TTC Visualizer</ListItem>
            <Block>
              <List>
                <ListItem>
                  A web app that shows Toronto Transit Commission vehicles on a
                  map in (almost) real time
                </ListItem>
              </List>
            </Block>

            <ListItem>AI Pong</ListItem>
            <Block>
              <List>
                <ListItem>
                  A web-app pong game where the computer learns to play pong
                  over time by playing against a human
                </ListItem>
              </List>
            </Block>
          </List>
        </Block>
      </Block>
    </Layout>
  )
}

export const Head = () => <Seo title="Resume" />

export default Resume

export const pageQuery = graphql`
  query SiteMetadataTitle {
    site {
      siteMetadata {
        title
      }
    }
  }
`
