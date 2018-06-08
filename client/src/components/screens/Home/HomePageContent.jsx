import React from 'react'
import { Link } from 'react-router-dom'

const HomePageContent = () => (
  <div className="card bg-light mb-3" style={{ maxWidth: `${18}rem` }}>
    <div className="card-header">Content</div>
    <div className="card-body">
      <h5 className="card-title">Light card title</h5>
      <p className="card-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
        debitis et, maxime fugit labore nam animi! Unde optio expedita sapiente
        nam enim deleniti quia repudiandae iusto placeat, aliquid delectus nemo.
      </p>
    </div>
    <div className="card-footer">
      <Link className="btn btn-danger" to="/products">
        Create your own BitDummy
      </Link>
    </div>
  </div>
)

export default HomePageContent
