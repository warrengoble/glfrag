import React from 'react'
import ReactDOM from 'react-dom'
import GLFrag from './glfrag'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <GLFrag width={window.innerWidth} height={window.innerHeight}/>, document.getElementById('app'))
})
