import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
export default function ProductDetail() {
   const { id } = useParams();
   const [product, setProduct] = useState({});
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      fetch(`http://localhost:9999/products/${id}`)
         .then((res) => res.json())
         .then((result) => setProduct(result));

      fetch("http://localhost:9999/categories")
         .then((res) => res.json())
         .then((result) => setCategories(result));
   }, [id]);
   return (
      <Container fluid>
         <Row>
            <Col>
               <h1 style={{ textAlign: "center" }}>Product Detail</h1>
               <div>Product Name: {product?.name}</div>
               <div>Category:  {
                  categories && categories.find(c => c.id === product.category)?.name
               }</div>
               <div>Product Description: {product?.description}</div>
               <div>Price : {product?.price}</div>
               <div>VAT: {product?.vat}</div>
               <div>Discount: {product?.discount}</div>
               <div>Status: {product?.status === true ? "In stock" : "Out stock"}</div>
            </Col>
         </Row>
      </Container>
   );
}