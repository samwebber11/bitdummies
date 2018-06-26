import React, { Component } from 'react'

class ProductFilter extends Component {
  state = {
    open: false,
    accordion: 0,
  }

  handleClick = (event, num) => {
    event.preventDefault()
    if (this.state.open) {
      if (this.state.accordion === num) {
        this.setState({ open: false, accordion: 0 })
      } else {
        this.setState({ accordion: num })
      }
    } else {
      this.setState({ open: true, accordion: num })
    }
  }

  render() {
    return (
      <form>
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <button
                className={`btn btn-link ${
                  this.state.accordion === 1 ? '' : 'collapsed'
                }`}
                onClick={e => this.handleClick(e, 1)}
              >
                Categories
              </button>
            </h5>
          </div>
          <div
            className={`collapse ${this.state.accordion === 1 ? 'show' : ''}`}
          >
            <div className="card-body">
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">T-Shirts</label>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">Action Figures</label>
              </div>
              <div className="form-group form-check mb-0">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">Backpacks</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <button
                className={`btn btn-link ${
                  this.state.accordion === 2 ? '' : 'collapsed'
                }`}
                onClick={e => this.handleClick(e, 2)}
              >
                Sort By
              </button>
            </h5>
          </div>
          <div
            className={`collapse ${this.state.accordion === 2 ? 'show' : ''}`}
          >
            <div className="card-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="option1"
                />
                <label className="form-check-label">A to Z</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="option2"
                />
                <label className="form-check-label">Price - high to low</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  value="option3"
                />
                <label className="form-check-label">Price - low to high</label>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <button
                className={`btn btn-link ${
                  this.state.accordion === 3 ? '' : 'collapsed'
                }`}
                onClick={e => this.handleClick(e, 3)}
              >
                Size
              </button>
            </h5>
          </div>
          <div
            className={`collapse ${this.state.accordion === 3 ? 'show' : ''}`}
          >
            <div className="card-body">
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">XS</label>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">S</label>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">M</label>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">L</label>
              </div>
              <div className="form-group form-check mb-0">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">XL</label>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around">
          <button className="btn btn-outline-dark">Apply</button>
          <button className="btn btn-outline-dark">Reset</button>
        </div>
      </form>
    )
  }
}

export default ProductFilter
