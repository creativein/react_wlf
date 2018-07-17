import React, { Component } from 'react'
import './Tool.css'
export default class Tool extends Component {

  TOOLS = [
    {
      name: 'WORD_HIGHLIGHT',
      image: '',
      altText: ''
    }, {
      name: 'WORD_UNDERLINE',
      image: '',
      altText: ''
    }, {
      name: 'LETTER_IDENTIFICATION',
      image: '',
      altText: ''
    }, {
      name: 'DIVIDE',
      image: '',
      altText: ''
    },
    {
      name: 'ERASE',
      image: '',
      altText: ''
    }
  ]

  selectTool(tool, target) {
    this.props.onSelectTool(tool.name);
  }

  render() {
    const tools = this.TOOLS.map( (tool, index) => {
      return <div role="button" className="tool" key={index} onClick={this.selectTool.bind(this, tool)}>{tool.name}</div>
    })
    return (
      <div className="tool-box-wrapper">
        {tools}
      </div>
    )
  }
}
