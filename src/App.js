import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './components/navigation/Navigation'

class App extends Component {

  state = {
    title: '',
    direction: '',
    rounds: [],
  }

  componentDidMount() {
    axios.get(`./data/wlf_t1_v2_u2_w4_12345_lag___d.xml`)
      .then(response => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const rounds = xml.getElementsByTagName('rounds')[0].getElementsByTagName('round');
        const title = xml.getElementsByTagName('title')[0].innerHTML;
        this.setState({ title: title });
        this.updateRounds(rounds);
      })
  }

  updateRounds(rounds) {
    const roundsArray = [];
    const screensArray = [];
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
          sentences : sentences
        }
        screensArray.push(screen);
      })

      roundsArray.push({
        active: false,
        screens: screensArray
      })
    });
    this.setState({ rounds: roundsArray });
    console.log(roundsArray);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.title}</h1>
        </header>
        <Navigation rounds={this.state.rounds} />
      </div>
    );
  }
}

export default App;
