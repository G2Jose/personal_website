---
title: The Philosophy behind Titan Workout Tracker
date: 2023-07-20
---
#blog/post #projects/titan

A little while ago I wrote briefly about [why I built Titan](./introducing-titan). In this post I'd like to dive a little deeper into the philosophy that's shaped the app's development. My journey with fitness and technology has been intertwined for years, and Titan is the culmination of that experience — a tool designed to make workout tracking effortless, enjoyable, and truly user-centric.
## My Personal Fitness Journey
I first started lifting weights many years ago while I was in university. Like many students I was juggling academics and a social life and hitting the gym was a way to relieve stress and stay healthy. However, maintaining consistency was a challenge. Since then, I’ve lifted on and off, often with very long periods (1-2+ years) where I’d simply lose interest and stop exercising. My friends often joke about how I’ve been paying for a gym membership since 2011, and how absurd my average cost per workout session probably is.

Throughout this time, I’ve tried various methods to track my progress and keep myself motivated. I started with Google Sheets but quickly realized how messy things were getting. The manual entry was tedious, and analyzing the data wasn’t as straightforward as I’d hoped. I then moved on to apps, of which there are a ton.

While some of them were decent, they all had limitations that didn’t align with my needs. Many felt overly complex, with unnecessary features cluttering my experience. Others lacked essential functionalities or were too rigid to accommodate my workout style. Some were prohibitively expensive for what they offered, and a significant number didn’t allow for easy data exports. I consider working out a way of life, and I’m not sure I could commit to a single app holding my data for the entirety of my life. Data ownership became a concern — I wanted to ensure I could retain and control my workout history over the long term.
## The Opportunity
This is where I saw an opportunity to build something better than what existed. It wasn’t just about creating another app; it was about crafting a tool that genuinely addressed the pain points I and many others faced. This project also presented a chance for me to flex my product development skills, merging my passion for fitness, technology and the craft of building product.
 
I knew that to create an app that stood out, I had to focus on a few main areas:

### Simplicity
I struggle to name a product I enjoy using that does not embrace simplicity. The best products solve problems without overcomplicating the user experience. For Titan, the user interface had to be as simple and intuitive as possible. It should be obvious how to use the app without a lengthy (or really any) dedicated onboarding flow.

From the moment a user opens Titan, they should feel comfortable navigating through it. This meant eliminating clutter, using clear information architecture, and designing with the user’s natural workflow in mind. There shouldn't be hard to find menus or convoluted steps. Core actions should be no more than a few taps away.

### Functionality
Closely related to simplicity is functionality. Often the two tend to be a balance, but the best products can do both without compromising on either. 

For me this meant designing an experience where features stay out of the way until needed. A plate calculator for example, is only relevant when entering the weight using an on screen keyboard, and the 'create a custom exercise' flow is only relevant when adding an exercise to a workout session. My goal was to make features accessible without being intrusive.

### Measurement
> What gets measured gets improved

I'm finding some conflicting info on the origin of this quote, but I think it has a point, particularly when it comes to building habits. Maybe I'm a data nerd, but I didn't want to shy away from exposing as many metrics as possible, while still keeping the UI simple. To start, Titan has charts showing volume lifted, best set, number of reps etc, broken down by time and by exercise. It also has views showing workout consistency, and I expect that there will be more metrics shown in the future.

### Joy & Satisfaction
I wanted to also optimize for the emotions felt when using the app. I wanted it to evoke a sense of joy and satisfaction, as opposed to feeling like it was a chore. Working out is hard enough, tracking progress should not add to that. 

I wanted UI elements and flows to "Just Work", and exactly as one would expect it to (which in software engineering terms is called the [Principle of Least Astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)).

Animations and haptics are other great ways to make flows feel satisfying. Animation isn't an area I have a lot of experience in, but it should be fun to learn. I've been really impressed with animations I've seen in the [Family Wallet app](https://benji.org/family-values) and hope to bring some of my learnings to Titan.

UI responsiveness is another area that impacts how user experiences are perceived. Interactions should be smooth, and flows should feel immediate and snappy. 

### Data ownership
As mentioned earlier, I think lifting is a way of life, a habit one might have for the entirety of their life. Everything changes, including technology. While I hope I have sucess in building the best product to track workouts right now, I don't want my users to be chained to this technology forever. To me this means all data on the app should be easily exportable in a universal format (I used json). This should allow users to take their data with them, if / when they leave. 

It’s about respecting the user’s right to their information and acknowledging that the app serves them—not the other way around.

## Thanks for reading
Building Titan has been a labor of love. I appreciate you taking the time to read this post. If you're looking for a workout tracking app that values simplicity & functionality, I invite you to [give Titan a try](/).

# Related posts
```dataview
LIST WITHOUT ID "[["+file.name+"]]" + " " + dateformat(date, "yyyy MMM dd")
FROM #blog/post
WHERE contains(file.tags, "projects/titan") AND file.name != this.file.name
```