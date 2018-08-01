import React, {
  Component
} from 'react'

import {
  getPathFromCircleGroup
} from './metaballUtils'

import MetaballPath from './MetaballPath'
import PropTypes from 'prop-types'

let _id = 0

/**
 * Metaballs: a collection of circles organically joined
 */
class Metaballs extends Component {
  static propTypes = {
    easement: PropTypes.any, // d3
    preserveAspectRatio: PropTypes.string,
    duration: PropTypes.number, // in milliseconds
    padding: PropTypes.number,
    circles: PropTypes.array.isRequired
  }

  static defaultProps = {
    preserveAspectRatio: 'xMidYMid meet',
    duration: 750
  }

  state = {
    viewBox: '',
    circles: []
  }

  constructor(props) {
    super(props)
    this.state.circles = props.circles
    this.state.viewBox = this._getViewBox(props.circles, props.padding)
    this.state.id = _id++
  }

  updateCircles = (newCircles) => {
    this.setState({
      circles: newCircles
    })
  }

  _getViewBox = (circles = this.state.circles, scale = 1.1) => {
    let y = circles.map((circle) => circle.cy + circle.r)
    let x = circles.map((circle) => circle.cx + circle.r)
    return `0 0 ${Math.round(scale * Math.max(...x))} ${Math.round(scale * Math.max(...y))}`
  }

  render() {
    let {
      preserveAspectRatio = 'xMidYMid meet', duration = 750, easement
    } = this.props

    let {
      circles,
      viewBox,
      id
    } = this.state

    return (
      <svg xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        viewBox={viewBox}
        width='100%' height='100%'
        preserveAspectRatio={preserveAspectRatio}>
        <MetaballPath id={id} easement={easement} duration={duration} path={getPathFromCircleGroup(circles)} />
      </svg>
    )
  }
}

export default Metaballs
