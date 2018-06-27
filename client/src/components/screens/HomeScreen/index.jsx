import React, { Component } from 'react'

import Video from './Video'
import HomePageContent from './HomePageContent'
import ShowcaseCarousel from './ShowcaseCarousel'
import ImageContent from './ImageContent'
import ShowcaseImages from './ShowcaseImages'

class HomeScreen extends Component {
  state = {
    // video: {
    //   title: 'Creating a BitDummy',
    //   width: '711',
    //   height: '400',
    //   id: 'g4Hbz2jLxvQ',
    // },
    imageUris: [
      'https://source.unsplash.com/random/400x397',
      'https://source.unsplash.com/random/400x398',
      'https://source.unsplash.com/random/400x399',
      'https://source.unsplash.com/random/400x401',
      'https://source.unsplash.com/random/400x402',
      'https://source.unsplash.com/random/400x403',
    ],
  }

  render() {
    return (
      <div>
        <ShowcaseCarousel />
        {/* <div className="container">
          <div className="row pt-5">
            <div className="col-md-8">
              <Video video={this.state.video} />
            </div>
            <div className="pl-5 col-md-4">
              <HomePageContent />
            </div>
          </div>
        </div> */}
        <ImageContent
          imageUri="https://source.unsplash.com/random/600x398"
          heading="Eternalize your parents"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imagePos="right"
          imageUri="https://source.unsplash.com/random/600x399"
          heading="Capture your love"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imageUri="https://source.unsplash.com/random/600x400"
          heading="Frame their joy"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imagePos="right"
          imageUri="https://source.unsplash.com/random/600x401"
          heading="Keep that achievement"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ShowcaseImages imageUris={this.state.imageUris} />
      </div>
    )
  }
}

export default HomeScreen
