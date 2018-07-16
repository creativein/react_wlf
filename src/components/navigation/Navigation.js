import React, { Component, ReactChildren } from 'react';
import './Navigation.css'

class Navigation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const rounds = this.props.rounds.map(round => {
            return <div className="round"></div>
        })
        return (
            <footer>
                <button className="btn prev" onClick={() => this.onPrevClick()}> Prev </button>
                {rounds}
                <button className="btn next" onClick={() => this.onNextClick()}> Next </button>
            </footer>
        );
    }

    onPrevClick() {
        this.props.goBack();
    }

    onNextClick() {
        this.props.goForward();
    }

}

export default Navigation;