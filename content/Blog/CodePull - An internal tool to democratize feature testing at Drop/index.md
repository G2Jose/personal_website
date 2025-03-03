---
date: 2021-05-25
title: CodePull - An internal tool to democratize feature testing at Drop
---
#blog/post #react-native #typescript #developer-experience

> Publish date: `= this.file.frontmatter.date`

>[!note]
> This is a shorter version of a more detailed post I made internally at Drop. Some details have been omitted here to preserve confidentiality. 
> After its initial adoption in June 2021, CodePull became a core part of the development and testing workflow at Drop. 
# Background
React native is used at Drop to power the consumer app. React Native allows code to be written in Typescript, which under the hood calls platform specific APIs, resulting in the same codebase powering a fully native experience on Android & iOS. 

At a very high level, the overall development process followed currently looks something like this:
- Engineer writes code for a new feature on a branch, based on specs & designs aligned on as a cross functional team (engineering, design, product, data and other relevant functions for the feature in question)
- Once ready, the engineer creates a Pull Request to be reviewed by their peers.
	- Up until now, the engineer can really only see the changes they're making on a simulator, or on a test devices they have. 
	- To get more people involved in testing their work up to this point, there 2 ways, broadly speaking:
		- The engineer can set up a zoom call with relevant folks (usually design at this point) to walk them through their work via screen sharing
		- Alternatively, the engineer could create a new test build and distribute it internally using TestFlight
- Once the code is reviewed and approved by at least 2 other members of the engineering team, the PR is ready to be merged into a release branch
- Once the code is merged, an automated tool picks it up and pushes the changes to a QA build. From this point, the changes made are widely accessible to cross functional folks, as long as they have access to the QA track.

# The Problem
Looking at the process above, it becomes apparent that there are a few bottlenecks that can be improved on, particularly in sharing work in progress with cross functional members of the team in a scalable way. In particular: 

> The engineer can set up a zoom call with relevant folks (usually design at this point) to walk them through their work

This does not scale very well, because: 
- It is a synchronous process and requires finding a time that works for everyone
- Since the flow is being walked through on a simulator on the engineer's computer and screen shared, it's harder to spot small visual issues
- It's simply not the same as trying out a flow on one's device and evaluating how it 'feels' 

> Alternatively, the engineer could create a new test build and distribute it internally using TestFlight

This also does not scale very well because: 
- We have CI automation in place to automatically push any merged code into QA builds. Manually pushing any other code will get overwritten the next time another engineer's code is merged
- It only allows testing one thing at a time. Another engineer trying to do the same will cause their peer's test deployment to be overwritten

> Once the code is merged, an automated tool picks it up and pushes the changes to the QA builds. From this point, the changes made are widely accessible to cross functional folks, as long as they have access to the QA app

Testing at this phase is insufficient, as it can block continuous delivery. Any code merged into a release branch is expected to be free of bugs and ready for release so as to not block other engineers shipping their work. 

With this in mind, it becomes clear that there is an opportunity to improve tooling to allow sharing work in progress. The ideal solution here would: 
1. Make it quick and easy for an engineer to share their work in progress, without having to merge code into a release branch. There shouldn't be any additional manual work in doing this. 
2. Make it quick and easy for the person who wants to test out the work in progress to do so. They should ideally not have to keep track of build numbers, manually update builds etc. The easier the process, the more likely it will be used frequently.
3. Any process adopted here should not have any performance or security implications. 
# The solution
It turns out that we can actually build something to solve this problem. Keeping in mind that the vast majority of our code is written in typescript, with native code changes happening very infrequently, we could solve the above problems by simply making it possible for the app to 'pull' compiled typescript code on demand. 

This isn't very different to how [CodePush](https://microsoft.github.io/code-push/) works (where we're able to push production updates to users without going through the App / Play Store). 

We're calling this new system CodePull, and this is how it works: 
- An engineer commits code and pushes it to GitHub on their own feature branch
- A GitHub action is kicked off in response. The action compiles all the typescript code from the commit.
- It then pushes the compiled code into an s3 bucket with a special file name based on the git branch
- The app now has the ability to open special links created based on git branch name (eg: drop://codepull?name=feature-improved-search.zip. The engineer shares the link with anyone on the project team who wants to test.
- Opening the link causes the app to download the relevant WIP compiled code from the s3 bucket and restart itself, running the new code
-  Once done, the individual testing the feature can revert back to the regular app code
## Limitations
- While this should cover us for the majority of code we want to test, there will occasionally be times when we make native changes, where we'll have to create custom test builds
