import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      timerState: 'stopped', // 'stopped', 'running', 'paused'
      timerType: 'Session', // 'Session' or 'Break'
      timeLeft: 25 * 60, // Initial time in seconds
    };
  }

  componentDidMount() {
    this.audioBeep = new Audio('beep.mp3');
  }

  handleSessionIncrement = () => {
    if (this.state.sessionLength < 60 && this.state.timerState === 'stopped') {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength + 1,
        timeLeft: (prevState.sessionLength + 1) * 60,
      }));
    }
  };

  handleSessionDecrement = () => {
    if (this.state.sessionLength > 1 && this.state.timerState === 'stopped') {
      this.setState((prevState) => ({
        sessionLength: prevState.sessionLength - 1,
        timeLeft: (prevState.sessionLength - 1) * 60,
      }));
    }
  };

  handleBreakIncrement = () => {
    if (this.state.breakLength < 60 && this.state.timerState === 'stopped') {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength + 1,
      }));
    }
  };

  handleBreakDecrement = () => {
    if (this.state.breakLength > 1 && this.state.timerState === 'stopped') {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength - 1,
      }));
    }
  };

  handleStartStop = () => {
    if (this.state.timerState === 'stopped') {
      this.startTimer();
    } else {
      this.setState({ timerState: 'paused' });
      clearInterval(this.timer);
    }
  };

  handleReset = () => {
    clearInterval(this.timer);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      timerState: 'stopped',
      timerType: 'Session',
      timeLeft: 25 * 60,
    });
  };

  startTimer = () => {
    this.setState({ timerState: 'running' });
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.timeLeft === 0) {
          this.audioBeep.play();
          if (prevState.timerType === 'Session') {
            return {
              timerType: 'Break',
              timeLeft: prevState.breakLength * 60,
            };
          } else {
            return {
              timerType: 'Session',
              timeLeft: prevState.sessionLength * 60,
            };
          }
        }
        return { timeLeft: prevState.timeLeft - 1 };
      });
    }, 1000);
  };

  render() {
    const { sessionLength, breakLength, timerType, timeLeft, timerState } = this.state;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
      <div className="App">
        <h1>25 + 5 Clock</h1>
        <div className="length-control">
          <div>
            <p id="break-label">Break Length</p>
            <button id="break-decrement" onClick={this.handleBreakDecrement}>
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={this.handleBreakIncrement}>
              +
            </button>
          </div>
          <div>
            <p id="session-label">Session Length</p>
            <button id="session-decrement" onClick={this.handleSessionDecrement}>
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={this.handleSessionIncrement}>
              +
            </button>
          </div>
        </div>
        <div className="timer">
          <p id="timer-label">{timerType}</p>
          <p id="time-left">{displayTime}</p>
          <button id="start_stop" onClick={this.handleStartStop}>
            {timerState === 'stopped' ? 'Start' : 'Pause'}
          </button>
          <button id="reset" onClick={this.handleReset}>
            Reset
          </button>
        </div>
        <audio id="beep" src="beep.mp3" />
      </div>
    );
  }
}

export default App;
