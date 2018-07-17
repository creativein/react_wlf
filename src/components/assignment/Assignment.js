import React, { Component } from 'react'
import Sentence from './sentence/Sentence'
import { AllHtmlEntities } from 'html-entities'
import Tool from './tool/Tool'

const entities = new AllHtmlEntities();

export default class Assignment extends Component {
  
  state = { 
    selectedTool :  'HIGHLIGHT'
  }

  render() {
    return (
      <div>
        <h2>{entities.decode(this.props.direction)}</h2>
        <Sentence sentences={this.props.sentences}/>
        <Tool/>
      </div>
    )
  }
}
