---
title: My publishing setup in 2025
date: 2025-02-20
---
#blog/post   

Throughout the years I've tried various setups for publishing blog posts and notes online. I've tried custom react sites (using handwritten react apps in the dark days before [`create-react-app`](https://github.com/facebook/create-react-app) , which itself is now long deprecated) to frameworks like [Nextjs](https://nextjs.org/) and [Gatsby](https://www.gatsbyjs.com/). I felt like it never quite hit the spot for me. I found myself spending way more time tweaking the setup than on the actual writing.

Today my setup is much simpler. I write all my notes in [Obsidian](https://obsidian.md/). Anything I want to publish online, I do so using a couple of clicks and [Nathan George's](https://nathang.dev/) excellent [Webpage HTML Export](https://github.com/KosmosisDire/obsidian-webpage-export) plugin. 

The workflow looks something like this:
- Write content on obsidian
- Add a #blog/post tag
- Add a publish date to the note's frontmatter
- This note and the date metadata gets picked up by a dataview query on the index [[Blog]] page
- Use the Webpage HTML export plugin to export the Blog directory into a `docs` directory in a git repo
- The git repo on github is set to serve content from this directory via [Github Pages](https://pages.github.com/) on a custom domain

There are a few things I love about this new setup: 
- Hosting being done on github pages means I don't need to worry about things like hosting costs, caching, HTTPS certificates or redirecting from HTTP to HTTPS
- Obsidian lets me easily link between notes
- The [dataview plugin](https://blacksmithgu.github.io/obsidian-dataview/) lets me write simple queries to show dynamic content (for example the [[Blog]] page uses a dataview query to show all pages that have the #blog/post tag, grouped by year dynamically)
- The export even shows the graph view from obsidian, showing how notes link to each other

This is certainly not perfect, but my hope is that with this rather simple system, I can spend less time tweaking the setup, and more time on the content.

## Appendix
The markdown code for this page looks like this: 
```markdown
---
date: 2025-02-20
---
#blog/post   

> Publish date: `= this.file.frontmatter.date`

Throughout the years I've tried various setups for publishing blog posts and notes online. I've tried custom react sites (using handwritten react apps in the dark days before [`create-react-app`](https://github.com/facebook/create-react-app) , which itself is now long deprecated) to frameworks like [Nextjs](https://nextjs.org/) and [Gatsby](https://www.gatsbyjs.com/). I felt like it never quite hit the spot for me. I found myself spending way more time tweaking the setup than on the actual writing.

Today my setup is much simpler. I write all my notes in [Obsidian](https://obsidian.md/). Anything I want to publish online, I do so using a couple of clicks and [Nathan George's](https://nathang.dev/) excellent [Webpage HTML Export](https://github.com/KosmosisDire/obsidian-webpage-export) plugin. 

The workflow looks something like this:
- Write content on obsidian
- Add a #blog/post tag
- Add a publish date to the note's frontmatter
- This note and the date metadata gets picked up by a dataview query on the index [[Blog]] page
- Use the Webpage HTML export plugin to export the Blog directory into a `docs` directory in a git repo
- The git repo on github is set to serve content from this directory via [Github Pages](https://pages.github.com/) on a custom domain

There are a few things I love about this new setup: 
- Hosting being done on github pages means I don't need to worry about things like hosting costs, caching, HTTPS certificates or redirecting from HTTP to HTTPS
- Obsidian lets me easily link between notes
- The [dataview plugin](https://blacksmithgu.github.io/obsidian-dataview/) lets me write simple queries to show dynamic content (for example the [[Blog]] page uses a dataview query to show all pages that have the #blog/post tag, grouped by year dynamically)
- The export even shows the graph view from obsidian, showing how notes link to each other

This is certainly not perfect, but my hope is that with this rather simple system, I can spend less time tweaking the setup, and more time on the content.

```

The markdown code for the [[Blog]] index page looks like this: 
```markdown
#blog 

\`\`\`dataviewjs
let posts = dv.pages('#blog/post')
  .where(p => p.file.frontmatter.date && moment(p.file.frontmatter.date, ["YYYY-MM-DD", moment.ISO_8601], true).isValid())
  .sort(p => moment(p.file.frontmatter.date, ["YYYY-MM-DD", moment.ISO_8601], true), 'desc');

let groups = {};
for (let post of posts) {
  let m = moment(post.file.frontmatter.date, ["YYYY-MM-DD", moment.ISO_8601], true);
  if (!m.isValid()) continue;
  let year = m.year();
  if (!groups[year]) groups[year] = [];
  groups[year].push(post);
}

let sortedYears = Object.keys(groups).sort((a, b) => b - a);

for (let year of sortedYears) {
  dv.header(2, year);
  let items = groups[year].map(post => {
    let m = moment(post.file.frontmatter.date, ["YYYY-MM-DD", moment.ISO_8601], true);
    let formattedDate = m.format("MMMM D, YYYY");
    return `[[${post.file.name}]] ${formattedDate}`;
  });
  dv.list(items);
}
\`\`\`
```
