import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export default class extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      k: PropTypes.string,
      v: PropTypes.number,
      a: PropTypes.string, // aesthetics
    })).isRequired,
  }
  constructor(props) {
    super(props)
    this.ref_svg = React.createRef()
    this.ref_div = React.createRef()
    this.initSVG()
  }
  componentDidMount() {
    this.draw(this.props.data)
  }
  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) this.draw(nextProps.data)
    return false
  }
  initSVG() {
    if (process.env.APP_ENV === 'server') return
    const outerRadius = 180
    const d3 = {
      selection: import('d3-transition').then(m => {
        return m.transition().selection()
      }),
      pie: import('d3-shape/src/pie').then(m => {
        return m.default()
          .sort((a, b) => a.k.localeCompare(b.k))
          // .sort(null)
          .value(function (d) { return d.v })
      }),
      arc: import('d3-shape/src/arc').then(m => {
        return m.default().outerRadius(outerRadius).innerRadius(0)
      }),
      arcText: import('d3-shape/src/arc').then(m => {
        return m.default().outerRadius(outerRadius).innerRadius(outerRadius * 0.5)
      }),
      colors: import('d3-scale-chromatic/src/categorical/category10').then(m => m.default),
      interpolateObject: import('d3-interpolate/src/object').then(m => m.default),
    }

    const keys = Object.keys(d3)
    this.d3 = Promise.all(keys.map(d => d3[d]))
      .then(modules => {
        const tmp = {}
        keys.forEach((c, i) => { tmp[c] = modules[i] })
        return tmp
      })
  }
  draw(data) {
    if (process.env.APP_ENV === 'server') return
    const transitionDuration = 750
    const differenceBy = require('lodash/differenceBy')
    const intersectionBy = require('lodash/intersectionBy')
    this.d3.then(d3 => {
      const { selection, pie, arc, arcText, colors, interpolateObject } = d3

      this.svg = this.svg || selection
        .select(() => this.ref_svg.current)
        .append('g')
        .attr('transform', 'translate(180, 180)')

      const data_previous = this.svg.selectAll('path').data().map(d => d.data)

      const by = 'k'
      const elements_tobe_removed = differenceBy(data_previous, data, by)
      const elements_tobe_inserted = differenceBy(data, data_previous, by)
      const data_previous_x_data = intersectionBy(data_previous, data, by)
      const data_x_data_previous = intersectionBy(data, data_previous, by)
      const data_from = pie([].concat(elements_tobe_removed, data_previous_x_data, elements_tobe_inserted.map(d => ({ ...d, v: 0 }))))
      const data_to = pie([].concat(elements_tobe_removed.map(d => ({ ...d, v: 0 })), data_x_data_previous, elements_tobe_inserted))

      this.svg.selectAll('path').data(data_from, key)
        .enter()
        .append('path')
        .attr('stroke', '#fff')
        .attr('stroke-width', '1%')
        .classed('pointer', true)
      this.svg.selectAll('path').each(function (d) { this._data_from = d })
      this.svg.selectAll('path').data(data_to, key)
        .attr('fill', (d, i) => d.a || colors[i])
        .transition()
        .duration(transitionDuration)
        .attrTween('d', pathTween)
        .on('end', removeOnEnd)

      this.svg.selectAll('text').data(data_from, key)
        .enter()
        .append('text')
        .classed('pointer', true)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
      this.svg.selectAll('text').each(function (d) { this._data_from = d })
      this.svg.selectAll('text').data(data_to, key)
        .text(d => d.data.v || '')
        .transition()
        .duration(transitionDuration)
        .attrTween('transform', textTween)
        .on('end', removeOnEnd)

      this.div = this.div || selection.select(() => this.ref_div.current)

      const divs = this.div.selectAll('div')
        .data(data_to, key)
        .enter()
        .append('div')
        .classed('flex items-center p025', true)
      divs.append('span').classed('mr1 flex-none', true).style('width', '1rem').style('height', '1rem')
      divs.append('span').classed('break-word', true)
      this.div.selectAll('span:nth-child(1)').data(data_to, key).style('background-color', (d, i) => d.data.c || colors[i])
      this.div.selectAll('span:nth-child(2)').data(data_to, key).text(d => `${d.data.k} (${d.data.v})`)
      this.div.selectAll('div').each(removeOnEnd)

      function pathTween(d) {
        const int = interpolateObject(this._data_from, d)
        return function (t) {
          return arc(int(t))
        }
      }
      function textTween(d) {
        const int = interpolateObject(arcText.centroid(this._data_from), arcText.centroid(d))
        return function (t) {
          const pos = int(t)
          return `translate(${pos[0]}, ${pos[1]})`
        }
      }
    })
    function key(d) { return d.data.k }
    function removeOnEnd(d) { d.value === 0 && this.remove() }
  }
  render() {
    return (
      <Fragment>
        <svg
          width="100%"
          // height="100%"
          style={{ maxWidth: '360px' }}
          className="block mx-auto"
          viewBox="0 0 360 360"
          ref={this.ref_svg}
        />
        <div ref={this.ref_div} />
      </Fragment>
    )
  }
}
