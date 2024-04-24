
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './Product';
import Header from './Header';
import Footer from './Footer';
import SignUp from './SignUp';
import Login from './Login';
import { Container, Row, Col } from 'react-bootstrap';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';
import AddProduct from './AddProduct';
import Cart from './Cart';
import Order from './Order';
import OrderHistory from './OrderHistory';
import Payment from './Payment';


const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Container>
          <Row style={{ marginTop: "15px" }}>

            <Routes>
              <Route path='/' element={<Product />} />
              <Route path='/home' element={<Product />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/products/category/:category" element={<Product />} />
              <Route path='/auth/SignUp' element={<SignUp />} />
              <Route path='/auth/SignIn' element={<Login />} />
              <Route path='/admin/products' element={<ProductList />} />
              <Route path='/admin/product/create' element={<AddProduct />} />
              <Route path="/admin/product/edit/:id" element={<EditProduct />} />
              <Route path="/admin/product/delete/:id" element={<DeleteProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path='/verifyOrder' element={<Order />} />
              <Route path='/orderHistory/:custId' element={<OrderHistory />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>

          </Row>
        </Container>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
