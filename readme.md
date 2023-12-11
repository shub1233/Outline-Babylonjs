# Shub Getting Started Template For Babylon Project

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:port_id
npm run dev

# Build for production in the dist/ directory
npm run build
```
## Thought Process Behind This Assignment
1. Create a template project to implement each module separately. As I haven't used Babylon before, this is how I started.
    [screenshot](./static/ss1.png)

2. The main challenge of this Assignment was drawing an outline, As there are multiple ways to implement it, I know two of them
   
   a. Drawing an Object twice, such that culling its backfaces makes the outline
   
   b. Post-processing using Depth buffer

I picked the first one, Mainly because, I did not have experience with babylonjs and its structure of maintaining buffers, Also I went through multiple articles where drawing another object with only its backfaces is not that expensive compared to post-processing on every frame

3. I previously have implemented God Rays Effects using only WebGL, The process of generating passes is similar to the outline the only difference is we need to compute the outline using depth texture. Here is the link to god rays using post-processing

    GitHub: https://github.com/shub1233/God-Rays
    Live: https://shub1233.github.io/God-Rays/




