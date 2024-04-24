import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

export default function SignUp() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [dob, setDob] = useState("");
   const [gender, setGender] = useState("");
   const [account, setAccount] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      fetch("http://localhost:9999/accounts")
         .then(res => res.json())
         .then(result => setAccount(result));
   }, []);

   const handleSubmit = (e) => {
      e.preventDefault();
      const newAccount = { email, password, dob, gender };
      if (validProduct(newAccount)) {
         fetch("http://localhost:9999/accounts", {
            method: "POST",
            body: JSON.stringify(newAccount),
            headers: new Headers({'content-type': 'application/json',Accept: 'application/json',})
         })
            .then(res => res.json())
            .then(result => {
               if (result) {
                  alert(` Create account success`);
                  navigate('/');
               }
            })
      }
   };

   function validProduct({ email, password, dob, gender }) {
      let msg = '';

      if (email === "") {
         msg += "Email is required\n";
      } else if (!email.match(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/)) {
         msg += "Invalid Email";
      } else {
         const foundAccount = account.find(a => a.email === email);
         if (foundAccount) {
            msg += ", This Email already exists.";
         }
      }

      if (password === "") {
         msg += ", Password is required";
      } else if (password.length < 8) {
         msg += ", Password must be at least 8 characters";
      }
      
      if (msg.length !== 0) {
         alert(msg);
         return false;
      }

      return true;
   }
   return (
      <Container>
         <Row>
            <Col>
               <h3 style={{ textAlign: "center", textTransform: "uppercase" }}>Sign Up</h3>
            </Col>
         </Row>
         <Row>
            <Col>
               <Form onSubmit={(e) => handleSubmit(e)}>
                  <Form.Group className="mb-3">
                     <Form.Label>Email (*)</Form.Label>
                     <Form.Control onChange={e => setEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Password (*)</Form.Label>
                     <Form.Control type='password' onChange={e => setPassword(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Date of Birth</Form.Label>
                     <Form.Control type='date' onChange={e => setDob(e.target.value)} />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                     <Form.Label>Gender</Form.Label>
                     <div>
                        <Form.Check
                           type='checkbox'
                           label='Female'
                           id='female'
                           onChange={() => setGender('female')}
                        />
                        <Form.Check
                           type='checkbox'
                           label='Male'
                           id='male'
                           onChange={() => setGender('male')}
                        />
                        <Form.Check
                           type='checkbox'
                           label='Other'
                           id='other'
                           onChange={() => setGender('other')}
                        />
                     </div>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                     <input type='submit' value={'Create'} className='btn btn-success' />
                  </Form.Group>
               </Form>
            </Col>
         </Row>
      </Container>
   )
}