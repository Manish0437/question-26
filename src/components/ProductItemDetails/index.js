import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

class ProductItemDetails extends Component {
  state = {
    productDetails: null,
    similarProducts: [],
    quantity: 1,
    apiStatus: 'initial',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: 'inProgress'})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const {product} = fetchedData
        const {similar_products: similarProducts} = product

        this.setState({
          productDetails: product,
          similarProducts,
          apiStatus: 'success',
        })
      } else {
        throw new Error('Failed to fetch product details')
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      this.setState({apiStatus: 'failure'})
    }
  }

  handleIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  handleDecrement = () => {
    this.setState(prevState => ({
      quantity: Math.max(prevState.quantity - 1, 1),
    }))
  }

  renderProductDetails = () => {
    const {productDetails, quantity} = this.state

    if (!productDetails) return null

    const {
      id,
      imageUrl,
      title,
      price,
      brand,
      rating,
      totalReviews,
      description,
      availability,
    } = productDetails

    return (
      <div className="product-details">
        <img src={imageUrl} alt="product" className="product-img" />
        <div>
          <h1>{title}</h1>
          <p>{price}</p>
          <p>{rating}</p>
          <p>{totalReviews}</p>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <div className="quantity-controls">
            <button
              type="button"
              aria-label="Save"
              onClick={this.handleDecrement}
            >
              <BsDashSquare />
            </button>
            <p>{quantity}</p>
            <button
              type="button"
              aria-label="Save"
              onClick={this.handleIncrement}
            >
              <BsPlusSquare />
            </button>
          </div>
          <button type="button" aria-label="Save" className="add-to-cart-but">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state

    if (similarProducts.length === 0) return null

    return (
      <div className="similar-products-cont">
        <h1>Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachProduct => (
            <Link
              to={`/product-details/${eachProduct.id}`}
              key={eachProduct.id}
            >
              <SimilarProductItem similarProduct={eachProduct} />
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    if (apiStatus === 'initial') {
      return null // Or you can render a loading indicator here
    }

    if (apiStatus === 'failure') {
      return (
        <div className="failure-view">
          <img src="failure-image-url" alt="products failure" />
          <h1>Failed to fetch product details</h1>
          <Link to="/products">
            <button type="button">Continue Shopping</button>
          </Link>
        </div>
      )
    }

    return (
      <div className="product-details-container">
        <Header />
        {apiStatus === 'inProgress' ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
          </div>
        ) : (
          <>
            {this.renderProductDetails()}
            {this.renderSimilarProducts()}
          </>
        )}
      </div>
    )
  }
}

export default ProductItemDetails
