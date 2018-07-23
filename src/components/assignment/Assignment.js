import React, {Component} from 'react'
import Sentence from './sentence/Sentence'
import {AllHtmlEntities} from 'html-entities'
import Tool from './tool/Tool'
import PubSub from 'pubsub-js';
import './Assignment.css'

const entities = new AllHtmlEntities();

export default class Assignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTool: "WORD_HIGHLIGHT",
            selectionType: "word"
        };
        this.toolEvent = 'changeToolState';
    }

    selectTool(toolName, type) {
        PubSub.publish(this.toolEvent, {
            selectedTool: toolName,
            selectionType: type
        });
    }
    validate(e){
        console.log("validate");
    }
    reset(e){
        console.log("reset");
    }

    render() {
        return (
            <div>
                <h2 className="direction">{entities.decode(this.props.direction)}</h2>
                <Sentence sentences={this.props.sentences} selectedTool={this.state.selectedTool}
                          selectionType={this.state.selectionType}
                />
                <Tool onSelectTool={this.selectTool.bind(this)}/>
                <button id="reset-btn" onClick={(e)=>{this.reset(e)}}>Reset</button>
                <button id="ok-btn" onClick={(e)=>{this.validate(e)}}>Ok</button>
            </div>
        )
    }
}
