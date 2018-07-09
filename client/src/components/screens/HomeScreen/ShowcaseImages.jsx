import React from 'react'
import propTypes from 'prop-types'

const ShowcaseImages = ({ imageUris }) => (
  <div className="row text-center">
    {imageUris.map(uri => (
      <div className="col-md-4 my-3" key={uri}>
        <img src={uri} alt="" />
      </div>
    ))}
  </div>
)

ShowcaseImages.propTypes = {
  imageUris: propTypes.arrayOf(propTypes.string).isRequired,
}

export default ShowcaseImages
