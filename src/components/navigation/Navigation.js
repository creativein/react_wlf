import React, { Component } from 'react';
import './Navigation.css';
class Navigation extends Component {


    render() {
        const rounds = this.props.rounds.map((round,index) => {
            return <div className="round" key={index}></div>
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