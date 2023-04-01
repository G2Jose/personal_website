import { ResumeSection } from "./types"

export const RESUME_CONTENT: ResumeSection = {
  title: "George J.",
  sections: [
    {
      title: "Summary",
      text: [
        `Product-minded generalist with years of experience in various capacities – technical leadership, people, process & project management, hands-on software development`,
        `Extensive experience leading teams and executing complex, open-ended projects in a startup environment`,
      ],
    },
    {
      title: "Work Experience",
      sections: [
        {
          title: "Drop Technologies Inc",
          sections: [
            {
              title: "Senior Engineering Manager",
              subtitle: "'22 – present",
              text: [
                "Managing 2 high performing full-stack, product engineering teams at Drop",
              ],
            },
            {
              title: "Engineering Manager",
              subtitle: "Core Team, ‘19 – ‘22",
              text: [
                "Managed a full stack product engineering team responsible for the mobile app’s core user experience; successfully scaled it into 2 distinct teams, each with their own areas of focus",
                `Worked with company leadership on translating company vision into objectives and key results`,
                `Worked closely with product managers, engineers, data scientists, designers and cross functional business teams on identifying, prioritizing and executing impactful projects`,
                {
                  text: `Provided technical leadership to the wider Drop engineering team, led several high impact, cross-team technical efforts`,
                  subText: [
                    `App Performance optimizations: Led a project that resulted in a drastic improvement to app responsiveness on the iOS & Android (react native) apps`,
                    `CodePull: Built an internal system that allows anyone at Drop to load up app changes from a pull request on their device by simply clicking an automatically generated link`,
                    `Test tooling: Built an internal framework that enables engineers to easily write comprehensive app integration tests leveraging realistic mock data`,
                  ],
                },
              ],
            },

            {
              title: "Engineering Lead",
              subtitle: "Growth Team, ‘18 – ‘19",
              text: [
                "Led a full stack engineering team of 4 individuals focused on product goals including user acquisition, engagement and retention",
                {
                  text: `Led tooling, process and other infrastructure initiatives focused on increasing developer happiness, productivity and code quality`,
                  subText: [
                    `Typescript: made the case for,got buyin and spearheaded migration; built internal tooling to track its adoption and assist with incremental migration; defined best practices and internal constructs to effectively write typesafe code`,
                    `Continuous Deployment: built tooling to continuously deploy merged app code to a staging environment`,
                    `Static code analysis: built internal rules for eslint & rubocop; rules rely on AST analysis to flag certain types of problematic code`,
                  ],
                },
              ],
            },

            {
              title: "Software Engineer",
              subtitle: "Drop Engineering Team, ‘18",
              text: [
                "Worked as one of the main primarily frontend-focused, full-stack software engineers building the Drop mobile app in react native + backend in ruby on rails",
                "Built and owned several impactful product domains including in-app shopping, referral program, card linking, marketing comms infrastructure, search, rewards etc",
                "Formalized and drove adoption of a regular app release process; also built tooling to enable anyone to quickly and safely release code",
              ],
            },
          ],
        },
        {
          title: "Deloitte",
          sections: [
            {
              title: "Senior Consultant",
              subtitle: "‘17 – ‘18",
              text: [
                {
                  text: `Tech Lead, Ecommerce Security Enhancement Program – Leading Canadian Retailer`,
                  subText: [
                    `Led a project to enhance security across 4 ecommerce stores owned by the retailer`,
                    `Implemented single sign-on, 2-factor authentication and other measures`,
                  ],
                },
                {
                  text: `Tech Lead, Self Scan & Checkout Program – Loblaw Digital`,
                  subText: [
                    `Led a project to build an in-store mobile scan and checkout experience`,
                    `Led building a user facing Point of Sale system for checkouts as well as the APIs integrating with the backend system`,
                  ],
                },
              ],
            },

            {
              title: "Consultant",
              subtitle: "‘16 – ‘17",
              text: [
                {
                  text: `Solutions Engineer, PC Optimum`,
                  subText: [
                    `Frontend solution engineer on a net new web presence for Canada’s largest loyalty program`,
                  ],
                },
              ],
            },

            {
              title: "Business Technology Analyst",
              subtitle: "‘15 – ‘16",
              text: [
                {
                  text: `Solutions Architect, Sonnet Insurance - Digital Transformation Program`,
                  subText: [
                    `Worked on solutions architecture team on a net new, multi-phased Direct to Consumer insurance program`,
                    `Worked across technical teams to ensure systems being built were inter- operable, followed development best practices and met security & performance requirements`,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Personal Projects",
      text: [
        {
          text: "A Journal A Day",
          subText: [
            `A privacy focused, cross platform app for daily, secure, journal entries`,
          ],
        },
        {
          text: "Communauto Watcher",
          subText: [
            `A react native app that allows users to set a geographic area to watch for and get notified when cars from a car share service are available to rent`,
            `Powered by a backend server running in koa & prisma ORM for postgres`,
          ],
        },
        {
          text: "TTC Visualizer",
          subText: [
            `A web app that shows Toronto Transit Commission vehicles on a map in (almost) real time`,
          ],
        },
        {
          text: "AI Pong",
          subText: [
            `A web-app pong game where the computer learns to play pong over time by playing against a human`,
          ],
        },
      ],
    },
  ],
}
