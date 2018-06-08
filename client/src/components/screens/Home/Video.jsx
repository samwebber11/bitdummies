import React from 'react'
import propTypes from 'prop-types'

const Video = ({ video }) => {
  const { title, width, height, id } = video

  return (
    <div className="embed-responsive embed-responsive-16by9">
      <iframe
        className="embed-responsive-item"
        title={title}
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  )
}

Video.propTypes = {
  video: propTypes.objectOf(propTypes.string),
}

Video.defaultProps = {
  video: {
    title: 'Video',
    width: '711',
    height: '400',
    id: 'dQw4w9WgXcQ',
  },
}

export default Video
