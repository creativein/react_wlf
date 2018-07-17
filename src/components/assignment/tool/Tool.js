import React, { Component } from 'react'
import './Tool.css'
export default class Tool extends Component {



  render() {
    return (
      <div className="tool-box-wrapper">
          <div className="tool">Word Highlight</div>
          <div className="tool">Word Underline</div>
          <div className="tool">Letter Identification</div>
          <div className="tool">Erase</div>
      </div>
    )
  }
}
