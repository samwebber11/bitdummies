import React, { Component } from 'react'

import Video from './Video'
import HomePageContent from './HomePageContent'

class Home extends Component {
  state = {
    video: {
      title: 'Creating a BitDummy',
      width: '711',
      height: '400',
      id: 'g4Hbz2jLxvQ',
    },
    showModal: false,
  }

  handleClick = () => {
    this.setState({ showModal: true })
  }

  render() {
    console.log(this.state.showModal)
    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-md-8">
            <Video video={this.state.video} />
          </div>
          <div className="pl-5 col-md-4">
            <HomePageContent />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
