import React, { Component } from 'react'
import { AllHtmlEntities } from 'html-entities'

const entities = new AllHtmlEntities();

export default class Assignment extends Component {

  constructor(props) {
    super(props);
  }
  
  state = { 
    selectedTool :  'HIGHLIGHT'
  }

  render() {
    return (
      <div>
        <h2>{entities.decode(this.props.direction)}</h2>
        {JSON.stringify(this.props.sentences)}
      </div>
    )
  }
}
