/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery<Queries.BioQuery>(graphql`
    query Bio {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  const author = data.site?.siteMetadata?.author
  const social = data.site?.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.png"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <>
          <p>
            Written by <strong>{author.name}</strong>, {author?.summary || null}
            . <br />
            All thoughts presented here are my own.{" "}
            <a href="https://www.linkedin.com/in/g2jose">Linkedin</a> |{" "}
            <a href="https://github.com/G2Jose">Github</a> |{" "}
            <a href="mailto:bigness_kudos00@icloud.com?body=%0D%0Asource%3A%20George's%20Blog">
              Email
            </a>
            .
          </p>
        </>
      )}
    </div>
  )
}

export default Bio
