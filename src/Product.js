import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Category from './Category';



export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { category } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetch(category ? `http://localhost:9999/products/?category=${category}` : "http://localhost:9999/products")
      .then(res => res.json())
      .then(result => {
        setProducts(result);
      });

    fetch("http://localhost:9999/categories")
      .then(res => res.json())
      .then(result => setCategories(result));

    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItemCount(cartItems.length);
    };

    window.addEventListener('storage', updateCartItemCount);

    return () => {
      window.removeEventListener('storage', updateCartItemCount);
    };
  }, [category]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const addToCart = (productId, productName) => {
    const productToAdd = products.find(product => product.id === productId);

    if (productToAdd.status) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingCartItemIndex = cartItems.findIndex(item => item.id === productId);

      if (existingCartItemIndex !== -1) {

        cartItems[existingCartItemIndex].quantity = (cartItems[existingCartItemIndex].quantity || 1) + 1;
      } else {

        cartItems.push({ ...productToAdd, quantity: 1 });
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert(`${productName} added to cart successfully!`);
      setCartItemCount(cartItems.length);
      window.location.reload();
    } else {
      alert(`${productName} is out of stock!`);
    }
  };


  const renderProducts = () => {
    const rows = [];
    for (let i = 0; i < currentProducts.length; i += 4) {
      rows.push(
        <div className="row" key={i}>
          {currentProducts.slice(i, i + 4).map(product => (
            <div key={product.id} className="col-md-3">
              <div className="card mb-3">
                <img src={`${process.env.PUBLIC_URL}/assets/image/${product.image}`} style={{ maxWidth: '100%', height: 'auto' }} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Price: ${product.price}</p>
                  <p className="card-text">Status: {product?.status === true ? "In stock" : "Out of stock"}</p>
                  <button type="button" className="btn btn-primary" onClick={() => addToCart(product.id, product.name)}>Add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <Container>
      <Row style={{ marginTop: "15px" }}>
        <Col xs={12} sm={5} md={3}><Category /></Col>
        <Col xs={12} sm={7} md={9}>
          {renderProducts()}
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Col>
      </Row>
    </Container>
  );
}
