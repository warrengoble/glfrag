# glFrag

A React component which is a 2D WebGL canvas fragment shader.

# Running
Just load build/index.html

# Development
Built using Webpack.  Just run webpack --watch.

#Implement
```
import React from 'react'
import ReactDOM from 'react-dom'
import GLFrag from './glfrag'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <GLFrag width={window.innerWidth} height={window.innerHeight}/>, document.getElementById('app'))
})
```
