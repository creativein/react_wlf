import React, { Component } from 'react'
import './Tool.css'
export default class Tool extends Component {

  TOOLS = [
    {
      name: 'WORD_HIGHLIGHT',
      image: '',
      altText: '',
      type: 'word'
    }, {
      name: 'WORD_UNDERLINE',
      image: '',
      altText: '',
      type: 'word'
    }, {
      name: 'LETTER_IDENTIFICATION',
      image: '',
      altText: '',
      type: 'letter'
    }, {
      name: 'DIVIDE',
      image: '',
      altText: '',
      type:'letter'
    },
    {
      name: 'ERASE',
      image: '',
      altText: '',
      type: 'all'
    }
  ]

  selectTool(tool) {
    this.props.onSelectTool(tool.name,tool.type);
    console.log("from tool");
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
