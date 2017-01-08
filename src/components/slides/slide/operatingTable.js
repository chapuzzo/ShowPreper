'use strict'

let React = require('react')
let _ = require('lodash')
import EditableComponent from 'components/widgets/editableComponent'
import AutoScale from 'components/mixins/autoScale'
import Draggable from 'components/mixins/draggable'
import Scalable from 'components/mixins/scalable'
import Selectable from 'components/mixins/selectable'
import Rotatable from 'components/mixins/rotatable'
import Killable from 'components/mixins/killable'
import lang from 'i18n/lang'
import GridImage from './img/grid.svg'
let key = require('mousetrap')

require('./operatingTable.less')

let OperatingTable = React.createClass({
  mixins: [AutoScale, Selectable, Draggable(function () {
      return this.props.selectedWidgets
    }, function (e) {
      return {
        x: this.props.component.components[e].x || 0,
        y: this.props.component.components[e].y || 0,
        z: this.props.component.components[e].z || 0
      }
    },
    function (e, updatedProps) {
      this.props.onSelectedWidgetUpdated && this.props.onSelectedWidgetUpdated({
        container: this.props.component,
        index: e
      }, updatedProps)
    }, function (e, updatedProps) {
      this.props.onSelectedWidgetUpdated && this.props.onSelectedWidgetUpdated({
          container: this.props.component,
          index: e
        }, updatedProps, lang.moveComponents
      )
    }), Scalable, Rotatable, Killable],
  getInitialState: function () {
    return {draggable: true, ctrlKeyPressed: false}
  },
  componentWillMount: function () {
    this.mouseDownHdlrs = []
    this.mouseUpHdlrs = []
  },
  componentDidMount: function () {
    this._resized()
    window.addEventListener('resize', this._resized)
    key.bind('g', this.onToggleGrid)
  },
  componentWillUnmount: function () {
    window.removeEventListener('resize', this._resized)
    key.unbind('g')
  },
  onToggleGrid: function (ev) {
    this.setState({showGrid: !this.state.showGrid})
  },
  _resized: function () {
    let deck = this.props.deck
    let slideWidth = this.props.component.width || deck.slideWidth
    let slideHeight = this.props.component.height || deck.slideHeight
    this._scale({width: slideWidth, height: slideHeight})
  },
  onMouseUp: function () {
    this.mouseUpHdlrs.forEach(e=>e.apply(this, arguments))
  },
  onMouseDown: function () {
    this.mouseDownHdlrs.forEach(e=>e.apply(this, arguments))
  },
  setDraggable: function (draggable) {
    this.setState({draggable: draggable})
  },
  render: function () {
    try {
      let slide = this.props.deck.getActiveSlide()
      let selectedWidgets = slide.components.reduce((pv, e, i, a)=> {
        if (e.selected) pv.push(i)
        return pv
      }, [])
      let componentsView = slide.components.map((component, index) => {
        return (
          <EditableComponent
            component={component}
            container={slide}
            onSelectedWidgetUpdated={this.props.onSelectedWidgetUpdated}
            key={index}
            idx={index}
            ref={index}
            scale={this.state.scale}
            selected={selectedWidgets.indexOf(index) >= 0}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onScaleMouseDown={this.onScaleMouseDown}
            onRotateMouseDown={this.onRotateMouseDown}
            onKillMouseDown={this.onKillMouseDown}
            setDraggable={this.setDraggable}
          />
        )
      })
      let otSlideStyle = _.merge({}, this.state.scaleStyle, this.props.thisSlideStyle || this.props.component.style || this.props.defaultSlideStyle || this.props.deck.defaultSlideStyle)
      if (this.props.deck.perspective) {
        otSlideStyle.perspective = (this.props.deck.perspective / this.state.scale) + 'px'
      }
      if (this.state.showGrid) {
        otSlideStyle.background = 'url(' + GridImage + ')'
      }
      return (
        <div className="sp-operating-table"
             onMouseDown={this.onSelectionMouseDown}
        >
          <div className="sp-ot-slide"
               style={otSlideStyle}>
            <svg className="sp-ot-dragger" width="64" height="64"
                 xmlns="http://www.w3.org/2000/svg">
              <g>
                <line stroke="#000000" y2="64" x2="32" y1="0" x1="32" strokeWidth="5" fill="none"/>
                <g>
                  <path transform="rotate(45 23.456237792968754,32) "
                        d="m21.072446,34.383791l0,-4.767581l4.767581,4.767581l-4.767581,0z" strokeWidth="5"
                        stroke="#000000"/>
                  <path stroke="#000000" transform="rotate(-135 40.54376220703125,32) "
                        d="m38.159972,34.38379l0,-4.76758l4.76758,4.76758l-4.76758,0z" strokeWidth="5"/>
                </g>
              </g>
            </svg>
            {componentsView}
          </div>
        </div>
      )
    }
    catch (ex) {
      return <div/>
    }
  }
})

module.exports = OperatingTable
