import React, {
  Component
} from 'react'

import * as d3 from 'd3'
import PropTypes from 'prop-types'

const NS = 'ReactMetaballs'

/**
 * Animated Metaball `path`.
 */
class MetaballPath extends Component {
  static propTypes = {
    easement: PropTypes.any,
    duration: PropTypes.number,
    path: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }

  state = {
    path: ''
  }

  constructor(props) {
    super(props)
    this.pathRef = React.createRef()
    this.state.path = props.path
  }

  componentDidMount() {
    this.path = d3.select(this.pathRef.current)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.path === nextProps.path) return

    let {
      duration,
      easement = d3.easeLinear
    } = this.props

    this.path.transition()
      .ease(easement)
      .attr('d', nextProps.path)
      .on('end', () => this.setState({
        path: nextProps.path
      }))
      .duration(duration)
  }

  render() {
    let {
      id
    } = this.props

    let {
      path
    } = this.state

    return (
      <g className={`${NS}__pathGroup`}>
        <path className={`${NS}__pathGroup__path`}
          ref={this.pathRef}
          id={`${NS}__path${id}`}
          d={path} />
      </g>
    )
  }
}

export default MetaballPath
