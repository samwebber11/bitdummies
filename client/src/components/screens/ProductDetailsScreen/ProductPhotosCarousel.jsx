import React from 'react'
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel'
import propTypes from 'prop-types'

const generatePhotos = ({ productImageUris, styles, imgStyles }) =>
  productImageUris.map(uri => (
    <div style={styles} key={uri}>
      <img style={imgStyles} src={uri} alt="" />
      <div className="carousel-caption">Image</div>
    </div>
  ))

const productImageUris = [
  'https://source.unsplash.com/random/500x598',
  'https://source.unsplash.com/random/500x599',
  'https://source.unsplash.com/random/500x600',
  'https://source.unsplash.com/random/500x601',
  'https://source.unsplash.com/random/500x602',
]

const styles = {
  width: '100%',
  height: 600,
}

const imgStyles = {
  width: '100%',
  height: '100%',
}

const product = {
  productImageUris,
  styles,
  imgStyles,
}

const ProductPhotosCarousel = props => (
  <ReactBootstrapCarousel
    animation
    autoplay={props.autoplay}
    slideshowSpeed={7000}
    ref={r => {
      this.slider = r
    }}
    version={4}
  >
    {generatePhotos(product)}
  </ReactBootstrapCarousel>
)

ProductPhotosCarousel.propTypes = {
  autoplay: propTypes.bool,
}

ProductPhotosCarousel.defaultProps = {
  autoplay: false,
}

export default ProductPhotosCarousel
