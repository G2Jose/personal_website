---
title: Visualizing transit vehicle locations on a map in real-time using React
date: "2017-07-09T22:12:03.284Z"
---
#blog/post

> Publish date: `= this.file.frontmatter.date`

In this blog post I’ll talk about how I built a visualization of Toronto Transit vehicle locations and some of the engineering challenges I ran into. A working demo can be found [on my personal website](https://georgejose.com/projects/livetransit/) (I’ve noticed some corporate networks blocking port 3000 and this application requires it), and all code can be found on [github](https://github.com/G2Jose/wheres-my-ttc).

![screenshot](img-1.webp)

## Picking Technologies

### 1. Tech Stack

The first step in building this app was to choose a tech stack to work with. I wanted a stack that would:

- Let me view on as many platforms as possible
- Not have to deal with an App Store publish / review process
  I decided to build a web app using React.

### 2. Map Library

There were a couple of different things I wanted from a mapping library:

- Be really fast
- Work well with react, or be easy to wrap inside a react component
- Be customizable, in order to prevent it from appearing just like google maps

[React-Map-GL](https://github.com/visgl/react-map-gl), a library built by Uber seemed to be a great candidate. React-Map-GL is built on top of [Mapbox-Gl-Js](https://docs.mapbox.com/mapbox-gl-js/api/), which in turn works using [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

### 3. Data Source

Most importantly, I had to find an API that gives me the data I want. I found an API called [Nextbus](https://gist.github.com/grantland/7cf4097dd9cdf0dfed14), which provides this data in XML. I then found a wrapper around it called [Restbus](https://github.com/morganney/restbus) that provides the same data as JSON. Restbus is provided as an easy to use node library as well as a [public url](http://restbus.info/api/agencies).

### 4. Hosting infrastructure

I decided to use an AWS EC2 instance to host the project.

## Building the app

### Backend

Getting the backend to work seemed really straightforward at first. I could just make requests to the restbus API at http://restbus.info/api/agencies and display it on a map. However, I ran into some problems with this approach:

**Problem #1**: The Restbus API is hosted on HTTP, while my website is hosted on HTTPS. Most browsers block HTTPS websites from requesting insecure resources.

**Problem #2**: I noticed that the public Restbus API went down when I made too many consecutive requests. This could be due to some sort of rate limiting.

I realized I could overcome _Problem #1_ by deploying my own instance of the Restbus API that calls Nextbus. I could then solve any rate limits imposed by Nextbus by caching responses for a few seconds using redis.

This is what my server.js file looked like:

```javascript
// server.js
const rb = require("restbus")
const app = require("express")()
const redis = require("redis")

const redisClient = redis.createClient()

// Get data from redis given a key
const getKey = key =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (error, result) => {
      if (!error && result) resolve(result)
      else reject(error)
    })
  })

// Set value for a key in redis with a given expiry
const setKey = (key, val, expiry = 5) => {
  let str = ""
  if (typeof val === "string") str = val
  else str = JSON.stringify(val)
  redisClient.setex(key, expiry, str)
}

// Make the API callable from anywhere
const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
}

app.use(corsMiddleware)

// Middleware to check if a value was stored in redis
app.use((req, res, next) => {
  getKey(req.url)
    .then(val => {
      console.info("found in cache")
      // Return cached data
      res.json(JSON.parse(val))
    })
    .catch(error => {
      console.info("Not found in cache")
      const json = res.json
      // Override the res.json function to do more than just return json
      res.json = function (...args) {
        // Cache the response
        setKey(req.url, args[1])
        json.call(this, ...args)
      }
      next()
    })
})

app.use("/", rb.app)

app.listen(3000)
```

To use redis, I simply used the docker image provided by them.

### Frontend

I used create-react-app to bootstrap the react frontend, and added the react-map-gl library. I ran into some issues with react-map-gl not building correctly (https://github.com/uber/react-map-gl/issues/176), but fixed it by [ejecting from create-react-app](https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/README.md#npm-run-eject), and modifying the webpack config to also process files from react-map-gl.

I used RxJS to take care of API requests. I could then subscribe to these streams in my map component. I set it up to make requests every 2 seconds.

```javascript
// api.js
import axios from "axios"
import Rx from "rxjs"

const API_URL = "https://georgejose.com:3002/agencies/ttc/vehicles"

export const getVehicles = () =>
  new Promise((resolve, reject) => {
    axios.get(API_URL).then(response => resolve(response.data))
  })

export const timer = Rx.Observable.timer(0, 2000)

export const $vehicles = timer.flatMap(() => Rx.Observable.defer(getVehicles))
```

This is what my `Map.js` component first looked like. Locations are obtained from the `$vehicles` stream and stored in local component state.

```javascript
// map.js
import React from "react"
import MapGL from "react-map-gl"

import Marker from "./Marker.js"

import { $vehicles } from "../utils/api.js"
import { getRgbForValue } from "../utils/color.js"

class InteractiveMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        // Center at Toronto
        latitude: 43.6536025,
        longitude: -79.4004877,
        zoom: 13,
        width: this.props.width,
        height: this.props.height,
        startDragLngLat: null,
        isDragging: null,
      },
      mapStyle: "mapbox://styles/mapbox/dark-v9",
      xy: [],
    }
  }

  componentDidMount() {
    // Subscribe to the vehicle location stream
    $vehicles.subscribe(data => {
      this.setState({ xy: data })
    })
  }

  componentWillReceiveProps(nextProps) {
    // Resize map if window is resized
    if (nextProps.height) {
      const newState = this.state
      newState.viewport.height = nextProps.height
      this.setState(newState)
    }
    if (nextProps.width) {
      const newState = this.state
      newState.viewport.width = nextProps.width
      this.setState(newState)
    }
  }

  _onChangeViewport = newViewport => {
    const viewport = Object.assign({}, this.state.viewport, newViewport)
    this.setState({ viewport })
  }

  render() {
    const { mapStyle, viewport } = this.state
    return (
      <MapGL
        mapboxApiAccessToken="XXX"
        onChangeViewport={this._onChangeViewport}
        mapStyle={mapStyle}
        ref={map => (this.map = map)}
        {...viewport}
      >
        {this.state.xy.map((xy, i) => {
          return (
            <Marker
              xy={{ x: xy.lat, y: xy.lon }}
              color={getRgbForValue(xy.secsSinceReport)}
              key={i}
              text={xy.routeId}
            />
          )
        })}
      </MapGL>
    )
  }
}

export default InteractiveMap
```

## Performance Engineering

1. One of the big issues I ran into was **lag**. Lots of it while panning the map around. Running the chrome profiler showed me the following:

The component update was taking 359ms to update after each API request. I soon noticed that this is caused due to the fact that **all ~900 markers were updating on every request**, regardless of what was displayed within the window.

Adding a condition to only update markers that are within the current window boundaries and re-running the chrome profiler showed me the following:

![Performance optimization 1](performance-optimization-1.webp)

47.27ms instead of 359.84ms for the same zoom level, **an improvement of ~750%**!

2. I also noticed that **network requests take rather long**.

![API performance before optimization](api-performance-1.webp)

Let’s see if the restbus API returns any data we do not need.

```json
{
  "id": "8084",
  "routeId": "168",
  "directionId": "168_1_168",
  "predictable": true,
  "secsSinceReport": 14,
  "kph": null,
  "heading": 266,
  "lat": 43.682335,
  "lon": -79.469849,
  "leadingVehicleId": null,
  "_links": {
    "self": {
      "href": "http://georgejose.com:3002/agencies/ttc/vehicles/8084",
      "type": "application/json",
      "rel": "self",
      "rt": "vehicle",
      "title": "Transit agency ttc vehicle 8084."
    },
    "to": [
      {
        "href": "http://georgejose.com:3002/agencies/ttc/vehicles/8084",
        "type": "application/json",
        "rel": "self",
        "rt": "vehicle",
        "title": "Transit agency ttc vehicle 8084."
      }
    ],
    "from": [
      {
        "href": "http://georgejose.com:3002/agencies/ttc/vehicles",
        "type": "application/json",
        "rel": "section",
        "rt": "vehicle",
        "title": "A collection of vehicles for agency ttc."
      },
      ...
    ]
  }
}
```

We’re only using a few fields out of this — `id`, `routeId`, `secsSinceLastReport`, `lat`, `lon`, and everything else can be ignored. Filtering this on the backend using an express middleware before sending a json response gives us:

![API performance after optimizing](api-performance-2.webp)

Response times are **on average a lot lower**!

3. **Functional Components**

The React docs recommend writing components as pure stateless functions whenever possible. Future improvements to react will have performance optimizations to components declared this way by avoiding unnecessary checks, memory allocations and lifecycle methods.

A hack to make functional components faster _right now_ is to call them as functions, as opposed to JSX nodes.

```javascript
const Component = (props) => (

  <div>{props}</div>
);
// Using component in JSX => slower
<div>
  <Component />
</div>
// Calling component as a regular function in curly braces => faster
<div>
  {Component()}
</div>
```

Although I didn't see a huge impact from this personally, there are several blog posts that report a big speedup. Here’s one:

- [45% Faster React Functional Components, Now
  ](https://medium.com/missive-app/45-faster-react-functional-components-now-3509a668e69f)

## Further Reading:

- [React Performance Tools](https://facebook.github.io/react/docs/perf.html)
- [React-Map-Gl](https://uber.github.io/react-map-gl/#/)
