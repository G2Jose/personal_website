---
title: Picking a tech stack for Titan Workout Tracker
date: "2024-09-20"
description: The decisions behind the tech stack used in Titan Workout Tracker
---

#blog/post #projects/titan #typescript #react #react-native 

Picking the right tool for the job is absolutely crucial, especially when you have limited time to spend on it. Picking the wrong stack could lead to tons of wasted effort, something I couldn't afford on Titan as a one-person project.

There are a few main pieces to the stack behind something like Titan. Broadly speaking they are: 
1. Frontend tech
2. Backend tech
3. Database & ORM
4. Infrastructure
5. Monitoring

I could also opt to go for a more 'managed' approach (commonly referred to as 'serverless'), and not have to worry about infrastructure.

## Frontend
High level my options, to start, were:
* Native apps built in [kotlin for Android](https://developer.android.com/kotlin) + [swift](https://developer.apple.com/swift/) for iOS
* Frameworks that package up web apps to run on mobile (eg: [Capacitor](https://capacitorjs.com) or [Cordova](https://cordova.apache.org))
* [Progressive Web App](https://web.dev/explore/progressive-web-apps) (PWA)
* [Flutter](https://flutter.dev)
* [React native](https://reactnative.dev)

The requirements I had for this part of the stack were: 
1. The end product should be an app that can run on Android and iPhone
    * Pretty much any of the above tech should meet this requirement
2. The app should look and feel native (i.e I didn't want it to be a repackaged web app)
    * This eliminated the PWA route, and frameworks like Capacitor. It's hard to get web components to look truly native.
3. I should be able to iterate quickly
    * This eliminates building two separate apps in two different technologies (swift / kotlin)
    * This also eliminated Flutter for me, as learning a new language ([Dart](https://dart.dev)) would take a little longer. Flutter also has a smaller community than react native, which also means there are fewer third party libraries for it.
    * The App Store and Play Store both have a review process to get updates out. While this exists to ensure quality, it can slow things down quite a bit (particularly on the App Store). The React native ecosystem has tools like [Expo Updates](https://docs.expo.dev/versions/latest/sdk/updates/) and [CodePush](https://microsoft.github.io/code-push/) that enable much quicker Over the Air updates especially for small changes.
4. The codebase should be maintainable long term
    * Maintaining 2 codebases with native code would be hard to do
    * This is a personal opinion, but this requirement also eliminated Flutter for me because of its association with Google. I'm personally afraid of building on top of google tech because of their history with breaking changes (eg: angular), and with shutting down projects with little warning (too many examples to list). I wanted to build on a mature technology that had a rock solid community around it. 

This led me to React Native with typescript. I've got a decent bit of experience with this tech, know many of it's pitfalls and how to avoid them, and it has a large community around it. I used the [Expo framework](https://expo.dev) as I didn't want to reinvent the wheel to solve common problems.

## Backend
I had some requirements in common here with the frontend, but also some other considerations. My requirements were: 

1. Quick iteration speed & good maintainability
  
  * I wanted something opinionated and 'batteries included', where I don't have to string together my own framework. I have some experience with [Rails](https://rubyonrails.org), and love these attributes about it. However, the lack of static typing IMO makes it harder to maintain. 
  * To an extent I wanted to minimize [technology sprawl](https://www.forrester.com/blogs/cios-get-tech-sprawl-under-control/). It would be a plus if the tech I picked here used the same language as the frontend (i.e typescript). 

2. Control & flexibility

  * An option was to go serverless and build the app using something like [Firebase](https://firebase.google.com) + [Cloud Functions](https://cloud.google.com/functions) or [AWS Lambda](https://aws.amazon.com/lambda/), but I had concerns about them not being as flexible as I wanted it to be. I didn't want my business logic to be limited to what the service supports.
  * I also didn't want my code to be vendor locked into a specific technology, one that it might outgrow someday. 
  * I figured I'd have the most control if I built my own backend with an open source community framework. 

3. Cost

  * Predictable and low cost was another attribute I was looking for, since I didn't know whether this project would succeed and bring in enough revenue to cover costs.
  * This meant I probably shouldn't be setting up a multi-node kubernetes cluster to get started 😂, instead I'd need to start smaller.

In the end I settled on [NestJS](https://nestjs.com). It provides a structured, scalable framework for building server-side applications with TypeScript. It naturally encourages a very modular architecture, supports dependency injection which makes testing easier, and incorporates sane design patterns. It also has a pretty rich ecosystem of libraries.

If I were to start the project today, I'd also consider [AdonisJS](https://adonisjs.com/) for its similarity to Rails.

## Database and ORM
The requirements I had for my database were: 
1. Have a strict, consistent schema
2. Support normalized data and efficient, complex queries with JOINs
3. Support transactions (i.e if a part of an operation fails, the part that succeeded is rolled back) and other [ACID guarantees](https://en.wikipedia.org/wiki/ACID)
4. Allow for the schema to evolve over time, without leading to inconsistent data
5. Be scalable

All this, arguably except (5), meant I'd need a relational database. It would mean that scaling would have to be [vertical](https://en.wikipedia.org/wiki/Scalability#Vertical_or_scale_up) instead of [horizontal](https://en.wikipedia.org/wiki/Scalability#Horizontal_or_scale_out), but it would be a fair tradeoff given all the other benefits. 

I started the project with [sqlite](https://www.sqlite.org/). However, soon after getting a few real users I moved onto [postgres](https://www.postgresql.org/) because I was running into bottlenecks with concurrent writes on sqlite. 

I wanted my backend application code that connects to the database to be maintainable (i.e I didn't want to have raw sql queries). This meant I needed an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping). Using an ORM gives me a higher level of abstraction to interact with data, and also makes it easier to switch out the underlying database without a lot of code changes. 

The main contenders here were [Sequelize](https://sequelize.org), [TypeORM](https://typeorm.io), [Prisma](https://www.prisma.io) and [Knex](https://knexjs.org). I picked Prisma for a few reasons: 

* Strong type safety with typescript
* Intuitive, GraphQL like query structure
* How your database schema can be defined (and later updated) through an intuitive [schema.prisma file](https://www.prisma.io/docs/orm/prisma-schema/overview). It also has very good IDE support on VSCode.

I'm also a big fan of [ActiveRecord](https://guides.rubyonrails.org/active_record_basics.html) on Rails, so I think TypeORM would've been nice to work with too. 

## Infrastructure

### Where the code runs
Now I had to decide where my server and database code would run. There are lots of options here, but they broadly fall into either: 

* [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) or PaaS
  * eg: [Heroku](https://www.heroku.com), [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com), [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
* [Infrastructure as a Service](https://en.wikipedia.org/wiki/Infrastructure_as_a_service) or IaaS
  * eg: [Amazon EC2](https://aws.amazon.com/ec2/), [Google Compute Engine](https://cloud.google.com/products/compute) 

I decided to go with [Amazon LightSail](https://aws.amazon.com/lightsail/) (it was a slightly cheaper than EC2). For disaster recovery in case something goes wrong with my instance, I also set up daily volume snapshots, which more or less put an upper bound on how much data I could lose. 

### Containerization
To keep the environment reproducible and straightforward, I containerized the API server and the database using [docker](https://www.docker.com). 

Service orchestration was done using [docker compose](https://docs.docker.com/compose/). 


### TLS / HTTPS
API requests needed to be encrypted using [https](https://www.cloudflare.com/en-ca/learning/ssl/what-is-https/) to prevent [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). This could be done on the API server level, but it's usually more scalable to do it at a higher level through a reverse proxy. I used [traefik](https://traefik.io/traefik/) to function as my reverse proxy.

I set up [certbot](https://certbot.eff.org) and [Let's Encrypt](https://letsencrypt.org) to generate HTTPS certificates on schedule before they expire. All of this was set up to work on my docker compose setup. 

## Monitoring 
I needed a way to know when something went wrong, something other than emails from my users. For this I set up 2 systems: 

1. [Sentry](http://sentry.io)
    * Sentry alerts me on errors thrown either on the server or on the app
2. [New Relic](https://newrelic.com/)
    * New Relic also picks up on errors, but does a lot more. It can be set up to alert on lots of different scenarios where an error might not be thrown. 
    * For example it can 'call' me if there's been an increased rate of HTTP failure codes in a given time period, or if my request times are trending higher than normal.
    * I also have it set up on the app, which gives me [distributed tracing](https://www.datadoghq.com/knowledge-center/distributed-tracing/), where I can track a user interaction to one or more API calls, to specific lines of code that runs on the server. This is a also a great way to debug application performance.

Personally I'm also a big fan of [Datadog](https://www.datadoghq.com/), but it's more costly for my use case.

## Thanks for reading

It's been a lot of fun to build this app. I appreciate you taking the time to read this post. If you're looking for a workout tracking app that values simplicity & functionality, I invite you to [give Titan a try](https://www.titangymapp.com).

# Related posts
```dataview
LIST WITHOUT ID "[["+file.name+"]]" + " " + dateformat(date, "yyyy MMM dd")
FROM #blog/post
WHERE contains(file.tags, "projects/titan") AND file.name != this.file.name
```
