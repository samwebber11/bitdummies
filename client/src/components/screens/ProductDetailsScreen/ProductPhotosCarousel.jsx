import React from 'react'
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel'
import propTypes from 'prop-types'

const generatePhotos = (images, styles, imgStyles) =>
  images.map(imageUri => (
    <div style={styles} key={imageUri}>
      <img style={imgStyles} src={imageUri} alt="" />
      <div className="carousel-caption">Image</div>
    </div>
  ))

const styles = {
  width: '100%',
  height: 600,
}

const imgStyles = {
  width: '100%',
  height: '100%',
}

const ProductPhotosCarousel = ({ autoplay, images }) =>
  images ? (
    <ReactBootstrapCarousel
      animation
      autoplay={autoplay}
      slideshowSpeed={7000}
      ref={r => {
        this.slider = r
      }}
      version={4}
    >
      {generatePhotos(images, styles, imgStyles)}
    </ReactBootstrapCarousel>
  ) : (
    <div>Loading...</div>
  )

ProductPhotosCarousel.propTypes = {
  autoplay: propTypes.bool,
  images: propTypes.arrayOf(propTypes.string),
}

ProductPhotosCarousel.defaultProps = {
  autoplay: false,
  images: undefined,
}

export default ProductPhotosCarousel
