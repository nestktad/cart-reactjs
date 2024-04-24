import { Container, Row, Col, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function OrderHistory() {

   const [order, setOrder] = useState([]);
   const [products, setProducts] = useState([]);

   const { custId } = useParams();

   useEffect(() => {
      fetch(custId ? `http://localhost:9999/orderDetails?customer.custID=${custId}` : `http://localhost:9999/orderDetails`)
         .then((res) => res.json())
         .then((data) => {
            
            setOrder(data);
         })

   }, [custId]);
   return (
      <Container fluid>
         <Row>
            <Col>
               <h1 style={{ textAlign: 'center' }}>Order History</h1>
            </Col>
         </Row>
         <Row>
            <Col>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>ID</th>
                        <th>Order Date</th>
                        <th>Require Date</th>
                        <th>Product</th>
                     </tr>
                  </thead>
                  <tbody>
                     {order.map(o => (
                        <tr key={o.id}>
                           <td>{o.id}</td>
                           <td>{o.orderDate}</td>
                           <td>{o.requiredDate}</td>
                           <td>
                              <ul>
                                 {o.products.map(product => (
                                    <li key={product.pId}>
                                       <Link to={`/product/${product.pId}`}>{product.name}({product.quantity})</Link>
                                    </li>
                                 ))}
                              </ul>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
            </Col>
         </Row>
      </Container>
   );
}