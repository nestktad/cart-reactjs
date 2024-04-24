import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, set, startOfToday } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
export default function Payment() {
   const [fname, setFname] = useState("");
   const [lname, setLname] = useState("");
   const [address, setAddress] = useState("");
   const [mobile, setMobile] = useState("");
   const [email, setEmail] = useState("");

   const [orderDate, setOrderDate] = useState("");
   const [requiredDate, setRequiredDate] = useState("");

   const [custID, setCustID] = useState(0);

   const [cartItems, setCartItems] = useState([]);
   const [totalPrice, setTotalPrice] = useState(0);

   const navigate = useNavigate();

   useEffect(() => {
      const today = startOfToday();
      const formattedDate = format(today, "yyyy-MM-dd");
      setOrderDate(formattedDate);
   }, []);
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

   useEffect(() => {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(storedCartItems);
   }, []);

   useEffect(() => {
      const account = JSON.parse(localStorage.getItem('account')) || [];
      setCustID(account?.id);
   }, []);

   useEffect(() => {
      let totalPrice = 0;
      cartItems.forEach(item => {
         const price = ((item.price) + (item.price * item.vat) - (item.price * item.discount)) * item.quantity;
         totalPrice += price;
      });
      setTotalPrice(totalPrice);
   }, [cartItems]);
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (localStorage.getItem('isLoggedIn') === 'true') {
         localStorage.setItem('customer', JSON.stringify({ fname, lname, address, mobile, email }));
      }

      if (!validCustomer({ fname, lname, address, mobile, email, requiredDate })) {
         return;
      }

      const orderProducts = cartItems.map(item => ({
         pId: item.id,
         name: item.name,
         price: item.price,
         quantity: item.quantity,
         vat: item.vat,
         discount: item.discount
      }));


      const orderDetail = {
         id: uuidv4(),
         orderDate,
         requiredDate,
         customer: {
            custID,
            fname,
            lname,
            address,
            mobile,
            email
         },
         products: orderProducts
      };

      fetch("http://localhost:9999/orderDetails", {
         method: "POST",
         body: JSON.stringify(orderDetail),
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
         }
      })
         .then(res => res.json())
         .then(result => {
            if (result) {
               localStorage.removeItem('cartItems');
               alert(`Checkout success`);
               navigate('/');
            } else {
               alert('An error occurred while processing the payment. Please try again later.');
            }
         })
         .catch(error => {
            alert('An error occurred while processing the payment. Please check your internet connection and try again.');
         });

      const serviceId = 'lab2';
      const templateId = 'Lab2';
      const publicKey = 'a04NOHJCgbasDgXVc';

      const data = {
         service_id: serviceId,
         template_id: templateId,
         user_id: publicKey,
         template_params: {
            from_name: `Economic shop`,
            from_email: email,
            to_name: 'Customer',
            message: "Checkout success",
         }
      };
      axios.post('https://api.emailjs.com/api/v1.0/email/send', data)
         .then(() => {
            alert('Your mail is sent!');
         })
         .catch(error => {
            alert('Oops... ' + error.message);
         });

   }


   function validCustomer({ fname, lname, address, mobile, email, requiredDate }) {
      let msg = '';

      if (fname === "" || lname === "" || address === "" || mobile === "" || email === "" || requiredDate === "") {
         msg += "Information is required.\n";
      }

      if (new Date(requiredDate) <= new Date(orderDate)) {
         msg += "Required date must be later than the order date.\n";
      }

      if (msg.length !== 0) {
         alert(msg);
         return false;
      }

      return true;
   }

   return (
      <Container>
         <Row style={{ marginTop: "15px" }}>
            <Col xs={12} sm={5} md={5}><img src={`${process.env.PUBLIC_URL}/assets/image/qrcode.jpg`} style={{ maxWidth: '100%', height: 'auto' }} className="card-img-top" /></Col>
            <Col xs={12} sm={7} md={7}>
               <Col>
                  <h3 style={{ textAlign: 'center', textTransform: 'uppercase' }}>Payment</h3>
               </Col>
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
                  <Form.Group className="mb-3">
                     <Form.Label>Required Date(*)</Form.Label>
                     <Form.Control type='date' onChange={(e) => setRequiredDate(e.target.value)} />
                  </Form.Group>
                  <Row>
                     <Col xs={12} style={{ textAlign: 'right' }}>
                        <h4>Total Price:{totalPrice}$</h4>
                     </Col>
                  </Row>
                  <Form.Group className='mb-3'>
                     <Button type="submit" variant="success">Confirm</Button>
                  </Form.Group>
               </Form>
            </Col>

         </Row>
      </Container>
   );
}