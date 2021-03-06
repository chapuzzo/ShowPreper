'use strict'
import React from 'react'
import lang from 'i18n/lang'
let TextBox = React.createClass({
  getInitialState: function () {
    return {editable: false}
  },
  componentWillUnmount() {
    delete this.editor
  },
  onDoubleClick: function (ev) {
    let reactEle = this
    this.setState({editable: true})
    this.props.setDraggable(false)
    if (this.editor) {
      return
    }
    let editor = this.editor = window.CKEDITOR.inline(this.refs.editableContent, {
      extraPlugins: 'sourcedialog'
    })
    editor.setData(this.props.component.text)
    editor.on('loaded', function () {
      let editable = editor.editable(this.element)
      editable.hasFocus = true
    })
    editor.on('blur', function (evt) {
      setTimeout(()=> {
          this.destroy()
          delete reactEle.editor
        }
        , 0)
      if (this.getData() !== reactEle.props.component.text) {
        reactEle.props.onSelectedWidgetUpdated && reactEle.props.onSelectedWidgetUpdated(reactEle.props.idx, {text: this.getData()})
      }
      reactEle.setState({editable: false})
      reactEle.props.setDraggable(true)
    })
    ev.stopPropagation && ev.stopPropagation()
  },
  render: function () {
    return <div
      style={this.props.style}
      className={this.props.className}
    >
      <div
        contentEditable={this.state.editable}
        title={this.props.selected ? lang.doubleClickEdit : null}
        onDoubleClick={this.props.editable && this.onDoubleClick}
        dangerouslySetInnerHTML={{__html: this.props.component.text}}
        ref="editableContent"
      />
    </div>
  }
})
module.exports = TextBox
