'use strict'
import ReactDOM from 'react-dom'
import lang from 'i18n/lang'

exports.onKillMouseDown = function (ev) {
  ev.stopPropagation && ev.stopPropagation()
  let i = this.props.component.components.length
  while (i > 0) {
    --i
    let e = this.props.component.components[i]
    if (e.selected) {
      this.props.onSelectedWidgetUpdated && this.props.onSelectedWidgetUpdated({
          container: this.props.component,
          index: i
        }
      )
    }
  }
}
