import React, { Component } from 'react'

export default class Assignment extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.props.sentences)}
      </div>
    )
  }
}
