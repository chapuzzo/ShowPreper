import React from 'react'
import 'spectrum-colorpicker'
import 'spectrum-colorpicker/spectrum.css'
import lang from 'i18n/lang'
import './index.less'
export default React.createClass({
  componentDidMount: function () {
    $("#sp-styler-modal").draggable({
      handle: ".modal-header"
    })
    $("#colorpicker").spectrum({
      color: "#f00",
      showAlpha: true,
      showInput: true,
    })
  },
  render: function () {
    let s
    switch (this.props.selectedStyleTarget) {
      case 'defaultSlide':
        s = this.props.defaultSlideStyle || this.props.deck.defaultSlideStyle
        break
      case 'thisSlide':
        s = this.props.thisSlideStyle || this.props.deck.getActiveSlide().style
        break
      case 'selectedSlides':
        s = this.props.selectedSlideStyle
        break
      case 'entirePresentation':
        s = this.props.deckStyle || this.props.deck.style
        break
    }
    return <div className="modal fade" id="sp-styler-modal" tabIndex="-1" role="dialog"
                aria-labelledby="sp-styler-modal-label">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 className="modal-title"
                id="sp-styler-modal-label">{lang.setAppearance} {lang[this.props.selectedStyleTarget]}</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                <div className="sp-styler-preview"
                     style={s}></div>
              </div>
              <div className="col-md-8">
                <ul className="nav nav-tabs">
                  <li className="active"><a data-toggle="tab" href="#spStylerTabBackground">{lang.background}</a></li>
                  <li><a data-toggle="tab" href="#spStylerTabBorder">{lang.border}</a></li>
                </ul>
                <div className="tab-content">
                  <div id="spStylerTabBackground" className="tab-pane fade in active">
                    <h3>{lang.background}</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                  </div>
                  <div id="spStylerTabBorder" className="tab-pane fade">
                    <h3>{lang.border}</h3>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.</p>
                  </div>
                </div>
                <input id='colorpicker'/>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

  }
})