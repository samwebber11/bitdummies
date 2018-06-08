import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <div className="container py-5 d-flex justify-content-around small">
    <section className="col-md-3">
      <h5 className="text-uppercase font-weight-bold">Need help</h5>
      <ul className="list-unstyled">
        <li>
          <Link className="text-secondary" to="/contact-us">
            Contact Us
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/faq">
            FAQs
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/terms-and-conditions">
            T&amp;Cs
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/return-and-exchange">
            Return &amp; Exchange
          </Link>
        </li>
      </ul>
    </section>
    <section className="col-md-3">
      <h5 className="text-uppercase font-weight-bold">Company</h5>
      <ul className="list-unstyled">
        <li>
          <Link className="text-secondary" to="/about-us">
            About Us
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/about-blockchain">
            About Blockchain
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/who-we-are">
            Who We Are
          </Link>
        </li>
      </ul>
    </section>
    <section className="col-md-3">
      <h5 className="text-uppercase font-weight-bold">More Info</h5>
      <ul className="list-unstyled">
        <li>
          <Link className="text-secondary" to="/my-account">
            My Account
          </Link>
        </li>
        <li>
          <Link className="text-secondary" to="/gift-vouchers">
            Gift vouchers
          </Link>
        </li>
      </ul>
    </section>
    <section className="col-md-3">
      <ul className="list-unstyled">
        <li>
          <i className="fas fa-lg fa-shopping-cart" />We serve all over the
          world
        </li>
        <li>
          <i className="fas fa-lg fa-shipping-fast" />15 Day easy returns
        </li>
      </ul>
    </section>
  </div>
)

export default Footer
