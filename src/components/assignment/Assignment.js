import React, { Component } from 'react'
import Sentence from './sentence/Sentence'
import { AllHtmlEntities } from 'html-entities'
import Tool from './tool/Tool'
import './Assignment.css'

const entities = new AllHtmlEntities();

export default class Assignment extends Component {
  
  state = { 
    selectedTool :  'WORD_HIGHLIGHT'
  }

  selectTool(toolName) {
    this.setState({selectedTool: toolName})
  }

  render() {
    return (
      <div>
        <h2 className="direction">{entities.decode(this.props.direction)}</h2>
        <Sentence sentences={this.props.sentences} selectedTool={this.state.selectedTool}/>
        <Tool onSelectTool={this.selectTool.bind(this)}/>
      </div>
    )
  }
}
