import React from 'react'

const fragment_shader = `
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/

precision highp float;
uniform vec3    iResolution;
uniform float   iGlobalTime;
varying vec2    fragCoord;

float field(in vec3 p) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(iGlobalTime) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 20; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

void main() {
	//vec2 uv = 2. * fragCoord.xy / iResolution.xy - 1.;
  vec2 uv = fragCoord.xy;

	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(sin(iGlobalTime / 16.), sin(iGlobalTime / 12.),  sin(iGlobalTime / 128.));
	float t = field(p);
	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	gl_FragColor = mix(.4, 1., v) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0);
}
`

const vertex_shader = `
attribute vec2 a_position;
attribute vec2 a_uv;

varying vec2 fragCoord;

void main() {
  fragCoord = a_uv;
  gl_Position = vec4(a_position, 0, 1);
}
`

export default class GLFrag extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: props.width,
      height: props.height
    }

    this.time = 0
    this.handleResize = this.handleResize.bind(this)
  }

  compileShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType)
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("could not compile shader:" + gl.getShaderInfoLog(shader))
    }

    return shader
  }

  createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("program filed to link:" + gl.getProgramInfoLog(program))
    }
    return program
  }

  setup2D(gl, program) {
    var positionLocation = gl.getAttribLocation(program, "a_position")
    var uvLocation = gl.getAttribLocation(program, "a_uv")

    var buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLocation)
    gl.enableVertexAttribArray(uvLocation)

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0)
  }

  componentDidMount() {
    // set up GL stuff here
    this.gl = null
    try {
      this.gl = this.refs.canvas.getContext("webgl") || this.refs.canvas.getContext("experimental-webgl")
    } catch (e) {
      console.log("Can't get WebGL context")
    }

    // test if Gl fails
    if (!this.gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.")
      this.gl = null
      return
    }

    this.vertexShader = this.compileShader(this.gl, vertex_shader, this.gl.VERTEX_SHADER)
    this.fragmentShader = this.compileShader(this.gl, fragment_shader, this.gl.FRAGMENT_SHADER)
    this.program = this.createProgram(this.gl, this.vertexShader, this.fragmentShader)
    this.gl.useProgram(this.program)

    this.setup2D(this.gl, this.program)

    this.iGlobalTime = this.gl.getUniformLocation(this.program, "iGlobalTime")
    this.iResolution = this.gl.getUniformLocation(this.program, "iResolution")

    // Draw first frame TODO add animation stuff in later
    this.gl.viewport(0, 0, this.state.width, this.state.height)
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, "iGlobalTime"), this.state.time)
    this.gl.uniform3f(this.iResolution, this.state.width, this.state.height, 0)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)

    const loop = time => {
      requestAnimationFrame(loop)

      this.time = time / 1000

      this.gl.uniform1f(this.gl.getUniformLocation(this.program, "iGlobalTime"), this.time)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
    requestAnimationFrame(loop)

    window.addEventListener('resize', this.handleResize)
  }

  handleResize() {
    var width = window.innerWidth
    var height = window.innerHeight

    this.setState({width: width, height: height})

    this.gl.viewport(0, 0, width, height)
    this.gl.uniform3f(this.iResolution, width, height, 0)
  }

  componentWillMount() {
    // TODO check if prop is fullscreen
    document.body.style.margin = '0px'
    document.body.style.padding = '0px'
    document.body.style.overflow = 'hidden'
  }

  render() {
    return (
      <canvas ref='canvas' width={this.state.width} height={this.state.height}></canvas>
    )
  }
}
