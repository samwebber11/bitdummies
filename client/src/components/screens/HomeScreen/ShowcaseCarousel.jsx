import React from 'react'
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel'
import propTypes from 'prop-types'

const generatePhotos = ({ showcaseImageUris, styles, imgStyles }) =>
  showcaseImageUris.map(uri => (
    <div style={styles} key={uri}>
      <img style={imgStyles} src={uri} alt="" />
      <div className="carousel-caption">Image</div>
    </div>
  ))

const showcaseImageUris = [
  'https://source.unsplash.com/random/1920x798',
  'https://source.unsplash.com/random/1920x799',
  'https://source.unsplash.com/random/1920x800',
  'https://source.unsplash.com/random/1920x801',
  'https://source.unsplash.com/random/1920x802',
]

const styles = {
  width: '100%',
  height: 600,
}

const imgStyles = {
  width: '100%',
  height: '100%',
}

const showcase = {
  showcaseImageUris,
  styles,
  imgStyles,
}

const ShowcaseCarousel = props => (
  <ReactBootstrapCarousel
    animation
    autoplay={props.autoplay}
    slideshowSpeed={7000}
    ref={r => {
      this.slider = r
    }}
    version={4}
  >
    {generatePhotos(showcase)}
  </ReactBootstrapCarousel>
)

ShowcaseCarousel.propTypes = {
  autoplay: propTypes.bool,
}

ShowcaseCarousel.defaultProps = {
  autoplay: false,
}

export default ShowcaseCarousel
