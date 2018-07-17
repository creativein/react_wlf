import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './components/navigation/Navigation'
import Assignment from './components/assignment/Assignment';

class App extends Component {

  state = {
    title: '',
    direction: '',
    rounds: [],
    currentRoundIndex: 0,
    currentScreenIndex: 0
  }

  componentDidMount() {
    axios.get(`./data/wlf_t1_v2_u2_w4_12345_lag___d.xml`)
      .then(response => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const rounds = xml.getElementsByTagName('rounds')[0].getElementsByTagName('round');
        const title = xml.getElementsByTagName('title')[0].innerHTML;
        const direction = xml.getElementsByTagName('directions')[0].innerHTML;
        this.setState({ title: title });
        this.setState({ direction: direction })
        this.updateRounds(rounds);
      })
  }

  updateRounds(rounds) {
    let roundsArray = [];
    let screensArray = [];
    rounds = Array.from(rounds);
    rounds.map((round, index) => {
      const screens = round.getElementsByTagName('screens')[0];
      let items = screens.getElementsByTagName('item');
      items = Array.from(items);

      // creating screens object for each round
      items.map((item) => {
        const sentencesHolder = item.getElementsByTagName('sentences')[0];
        let sentences = sentencesHolder.getElementsByTagName('sentence');
        sentences = Array.from(sentences);
        sentences = sentences.map(sentence => {
          return sentence.getElementsByTagName('text')[0].innerHTML
        });
        const screen = {
          sentences: sentences
        }
        screensArray.push(screen);
      })

      roundsArray.push({
        active: false,
        screens: screensArray
      })
      screensArray = [];
    });
    this.setState({ rounds: roundsArray });
    console.log(this.state.rounds);
  }

  goBack() {
    let screenIndex = this.state.currentScreenIndex;
    let roundIndex = this.state.currentRoundIndex;
    let rounds = this.state.rounds;
    let currentRound = rounds[roundIndex];

    if (screenIndex < (currentRound.screens.length - 1) && screenIndex != 0) {
      this.setState({ currentScreenIndex: screenIndex - 1 })
    } else if (roundIndex != 0) {
      this.setState({ 
        currentScreenIndex: rounds[roundIndex - 1].screens.length - 1, 
        currentRoundIndex: roundIndex - 1 
      });
    }

  }

  goForward() {
    let screenIndex = this.state.currentScreenIndex;
    let roundIndex = this.state.currentRoundIndex;
    let currentRound = this.state.rounds[roundIndex];

    if (screenIndex < (currentRound.screens.length - 1)) {
      this.setState({ currentScreenIndex: screenIndex + 1 })
    } else if ((roundIndex < this.state.rounds.length - 1)) {
      this.setState({ currentRoundIndex: roundIndex + 1, currentScreenIndex: 0 });
    }
  }

  render() {
    const assignment = (this.state.rounds.length > 0) ? <React.Fragment>
      <Assignment sentences={this.state.rounds[this.state.currentRoundIndex].screens[this.state.currentScreenIndex]}
        direction={this.state.direction} />
    </React.Fragment> : ''
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>
        </header>
        {assignment}
        <Navigation rounds={this.state.rounds}
          goBack={this.goBack.bind(this)}
          goForward={this.goForward.bind(this)} />
      </div>
    );
  }
}

export default App;
