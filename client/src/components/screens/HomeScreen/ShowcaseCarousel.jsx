import React from 'react'
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel'
import propTypes from 'prop-types'

const generatePhotos = (imageUris, styles, imgStyles) =>
  imageUris.map(uri => (
    <div style={styles} key={uri}>
      <img style={imgStyles} src={uri} alt="" />
      <div className="carousel-caption">Image</div>
    </div>
  ))

const ShowcaseCarousel = props => {
  const { autoplay, imageUris, styles, imgStyles } = props

  return (
    <ReactBootstrapCarousel
      animation
      autoplay={autoplay}
      slideshowSpeed={7000}
      ref={r => {
        this.slider = r
      }}
      version={4}
    >
      {generatePhotos(imageUris, styles, imgStyles)}
    </ReactBootstrapCarousel>
  )
}

ShowcaseCarousel.propTypes = {
  autoplay: propTypes.bool,
  imageUris: propTypes.arrayOf(propTypes.string).isRequired,
  styles: propTypes.shape({
    width: propTypes.any.isRequired,
    height: propTypes.any.isRequired,
  }),
  imgStyles: propTypes.shape({
    width: propTypes.any.isRequired,
    height: propTypes.any.isRequired,
  }),
}

ShowcaseCarousel.defaultProps = {
  autoplay: false,
  styles: {
    width: '100%',
    height: 600,
  },
  imgStyles: {
    width: '100%',
    height: '100%',
  },
}

export default ShowcaseCarousel
