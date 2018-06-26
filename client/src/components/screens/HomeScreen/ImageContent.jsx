import React from 'react'
import propTypes from 'prop-types'

const ImageContent = props => {
  const { imagePos, imageUri, heading, text } = props

  if (imagePos === 'left') {
    return (
      <div className="d-flex justify-content-around m-4">
        <div className="col-md-6 text-center">
          <img src={imageUri} alt="" />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>{heading}</h2>
          <p>{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex justify-content-around m-4">
      <div className="col-md-6 d-flex flex-column justify-content-center">
        <h2>{heading}</h2>
        <p>{text}</p>
      </div>
      <div className="col-md-6 text-center">
        <img src={imageUri} alt="" />
      </div>
    </div>
  )
}

ImageContent.propTypes = {
  imagePos: propTypes.string,
  imageUri: propTypes.string.isRequired,
  heading: propTypes.string.isRequired,
  text: propTypes.string.isRequired,
}

ImageContent.defaultProps = {
  imagePos: 'left',
}

export default ImageContent
