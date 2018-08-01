import React, {
  Component
} from 'react'

import Metaballs from 'react-metaballs'

import * as d3 from 'd3'

const CIRCLES = [{
    cx: 200,
    cy: 100,
    r: 64
  },
  {
    cx: 300,
    cy: 300,
    r: 96
  },
  {
    cx: 250,
    cy: 475,
    r: 56
  },
  {
    cx: 350,
    cy: 675,
    r: 128
  },
  {
    cx: 600,
    cy: 800,
    r: 76
  }
]

const INTERVAL = 2 * 1000 // 5 seconds

class App extends Component {
  state = {
    circles: CIRCLES
  }

  constructor(props) {
    super(props)
    this.metaballs = React.createRef()
    setInterval(this.updateCircles, INTERVAL)
  }

  // Update circle properties randomly
  updateCircles = () => {
    const getRandomArbitrary = (min = 0.5, max = 1.5) => {
      return Math.random() * (max - min) + min
    }

    let newCircles = CIRCLES.slice(0).map((circle) => ({
      cx: Math.round(circle.cx * getRandomArbitrary(0.9, 1.1)),
      cy: Math.round(circle.cy * getRandomArbitrary(0.9, 1.1)),
      r: Math.round(circle.r * getRandomArbitrary(0.66, 1.33))
    }))

    this.setState({
      circles: newCircles
    })
  }

  render() {
    let {
      circles
    } = this.state

    return (
      <div className="App">
        <Metaballs
          ref={this.metaballs}
          easement={d3.easeBackOut}
          circles={circles} />
      </div>
    )
  }
}

export default App
