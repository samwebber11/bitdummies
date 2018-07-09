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
    showcaseImageUris: [
      '/static/images/showcase/pic-1.jpg',
      '/static/images/showcase/pic-2.jpg',
      '/static/images/showcase/pic-3.jpg',
      '/static/images/showcase/pic-4.jpg',
      '/static/images/showcase/pic-5.jpg',
      '/static/images/showcase/pic-6.jpg',
    ],
    carouselImageUris: [
      '/static/images/carousel/pic-1.jpg',
      '/static/images/carousel/pic-2.jpg',
      '/static/images/carousel/pic-3.jpg',
      '/static/images/carousel/pic-4.jpg',
      '/static/images/carousel/pic-5.jpg',
    ],
  }

  render() {
    return (
      <div>
        <ShowcaseCarousel
          imageUris={this.state.carouselImageUris}
          styles={{ width: '100%', height: 600 }}
          imgStyles={{ width: '100%', height: '100%' }}
        />
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
          imageUri="/static/images/home/pic-1.jpg"
          heading="Eternalize your parents"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imagePos="right"
          imageUri="/static/images/home/pic-2.jpg"
          heading="Capture your love"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imageUri="/static/images/home/pic-3.jpg"
          heading="Frame their joy"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ImageContent
          imagePos="right"
          imageUri="/static/images/home/pic-4.jpg"
          heading="Keep that achievement"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime laborum quae aspernatur ut. Sapiente quibusdam sequi numquam ipsa nulla, distinctio quasi autem recusandae corporis beatae adipisci aspernatur aliquam nostrum officia alias vero labore cum reiciendis dolor possimus impedit. Sed delectus officia blanditiis, magni vitae temporibus aliquid accusamus illo quisquam molestias!"
        />
        <ShowcaseImages imageUris={this.state.showcaseImageUris} />
      </div>
    )
  }
}

export default HomeScreen
