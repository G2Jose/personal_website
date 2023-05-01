---
title: Exploring User Sentiment On Apps Using AI
date: "2023-04-30T22:12:03.284Z"
description: Building tools to analyze user sentiment from app reviews using OpenAI / ChatGPT.
image: "./img-5.png"
---

## The Problem

There isn't a very simple, free way of finding out what users think of your app without having to manually read and analyze large numbers of user written reviews.

There's an opportunity for an easy to use, conversational tool that helps app publishers understand:

- General user sentiment on their app
- Common positive and negative themes coming up
- How each of these datapoints are trending over time
- How their competitors stack up against them

From a personal point of view, I've been meaning to get more exposure to solving problems using emerging AI technologies.

## Solutioning

### Web App that calls OpenAI APIs

At first I figured this would be a great application of prompt engineering and one of the GPT APIs.

I started by simply copy pasting a number of reviews onto ChatGPT and asking it to summarize for me. I tried a few different prompts and both GPT 3.5 & 4. GPT 4 seemed to work significantly better, and using the prompt:

> You're given a list of reviews about an app named `${appName}`. Each review will be separated by a blank line. I'd like you to summarize for me the main themes being written about and how many reviews talk about these specific themes. Please group your response into a section about positive sentiment and negative sentiment. Below is the data:
> ...

Now I had to figure out a way to do this programmatically. For this I'd need:

- An API to fetch reviews
- A way to call OpenAI
- Some way of presenting the data

Apple provides what feels like an old iTunes RSS that returns reviews or items. This also seems to work with apps, and appending `/json` makes it return data in json format.

Calling OpenAI was pretty simple to do using [their official npm package](https://www.npmjs.com/package/openai).

NextJS was on my list of technologies I've been meaning to explore, so I chose this as the platform to build this on.

I ended up with a web app where you could visit https://appreviewsai.com/apps/$APP_ID to see a list of user reviews over the past two months (this can be easily extended to support custom date ranges). A lazy loaded component calls the OpenAI GPT 3.5 model to fetch the summary and display it.

At this point I ran into a few problems:

- The context window for GPT 3.5 as of now is ~4100 tokens. This meant that it would work fine for many apps, but would break apart for extremely popular apps like TikTok / Instagram, which receive a ton of reviews each day. This should be solvable through sampling.
- This worked very reliably during local development, but would sometimes fail when deployed to [vercel](https://vercel.com/?utm_source=google&utm_medium=cpc&utm_campaign=17166484769&utm_campaign_id=17166484769&utm_term=vercel&utm_content=134252114537_596484707957&gad=1&gclid=CjwKCAjwo7iiBhAEEiwAsIxQET331dd3LgGlGu6GXstSMtpB9EdDjsZoivblx6t__GGAgiFsL5jQ6hoCBIQQAvD_BwE). This turned out to be caused by [a 10 second timeout limit they enforce on their free plan](https://vercel.com/docs/concepts/limits/overview). I was able to get past this by simply upgrading to a trial of their pro plan which extends this to 60s.
- For the vast majority of apps out there, users don't write new reviews every few seconds. This meant I was calling (and paying for) more OpenAI API calls than I needed to. I solved for this by setting up a [supabase database](https://supabase.com/database). (Side note: I was very impressed with the [Ask Supabase AI feature](https://supabase.com/blog/chatgpt-supabase-docs) that allowed me to practically ask it to write the code I needed. This is definitely the future of all kinds of documentation.)

### ChatGPT Plugin

At this point I'd accomplished some of what I wanted to do. It did not however support the uase case of comparing sentiment on multiple apps very elegantly. I also didn't want to spend the time to build things like UI elements to allow for sorting, filtering, changing date ranges etc. A more conversational UX would be ideal.

Enter ChatGPT plugins, which I got developer access to very recently. Plugins are a way of extending what ChatGPT can do out of the box. This feature allows you to expose APIs for ChatGPT to intelligently call based on context.

Reading [the docs](https://platform.openai.com/docs/plugins/getting-started), I realized I could create one relatively easily. There were a handful of components I needed to get this working:

1. A set of API endpoints for ChatGPT to call
2. An [OpenAPI / Swagger spec describing your API endpoints](https://appreviewsai.com/openapi.yml)
3. A [manifest file telling ChatGPT what your plugin can do](https://www.appreviewsai.com/.well-known/ai-plugin.json)

I was able to build all of this into the same nextjs app without too much trouble. The main issue I ran into again was the context token limit of ~4100. I was able to get around this by samping reviews so it returns a maximum of 50 regardless of the timeframe requested. This was just a random number I picked that seemed to always work, but this can likely be tuned more preceisely.

I set up my ChatGPT account to use this plugin and I was pleasantly surprised by just how much it could do.
