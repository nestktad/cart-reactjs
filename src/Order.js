import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function Order() {

   const [fname, setFname] = useState("");
   const [lname, setLname] = useState("");
   const [address, setAddress] = useState("");
   const [mobile, setMobile] = useState("");
   const [email, setEmail] = useState("");

   const navigate = useNavigate();

   useEffect(() => {
      if (localStorage.getItem('customer') != null) {
         const account = JSON.parse(localStorage.getItem('customer'));
         setFname(account?.fname);
         setLname(account?.lname);
         setAddress(account?.address);
         setMobile(account?.mobile);
         setEmail(account?.email);

      }
   }, [])
   function handleSubmit(e) {
      e.preventDefault();
      if (localStorage.getItem('isLoggedIn') == 'true') {
         localStorage.setItem('customer', JSON.stringify({ fname, lname, address, mobile, email }));
      }
      if (validCustomer({ fname, lname, address, mobile, email })) {
         alert('Verify success');
         navigate('/cart');
      }

   }
   function validCustomer({ fname, lname, address, mobile, email }) {
      let msg = '';
      if (fname == "" || lname == "" || address == "" || mobile == "" || email == "") {
         msg += "Information is required";
      }
      if (msg.length != 0) {
         alert(msg);
         return false;
      }

      return true;
   }
   return (
      <div>
         <Container>
            <Row>
               <Col>
                  <h3 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Verify Order</h3>
               </Col>
            </Row>
            <Row>
               <Col>
                  <Form onSubmit={handleSubmit} style={{ width: "60%", margin: "auto", marginTop: "10px", marginBottom: "10px" }}>
                     <Form.Group className="mb-3">
                        <Form.Label>Fist name(*)</Form.Label>
                        <Form.Control placeholder='Enter Fist Name' onChange={(e) => setFname(e.target.value)} value={fname} />
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Last Name(*)</Form.Label>
                        <Form.Control placeholder='Enter Last Name' onChange={(e) => setLname(e.target.value)} value={lname} />
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Address(*)</Form.Label>
                        <Form.Control placeholder='Enter Address' onChange={(e) => setAddress(e.target.value)} value={address} />
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Mobile(*)</Form.Label>
                        <Form.Control type='number' placeholder='Enter Mobile' onChange={(e) => setMobile(e.target.value)} value={mobile} />
                     </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>Email(*)</Form.Label>
                        <Form.Control type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} value={email} />
                     </Form.Group>
                     <Form.Group className='mb-3'>
                        <Button type="submit" variant="success">Verify</Button>
                     </Form.Group>
                  </Form>
               </Col>
            </Row>
         </Container>
      </div>
   );
}