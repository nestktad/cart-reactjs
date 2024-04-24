import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <Container>
        <Row>
          <Col>
            <p>© 2024 Company, Inc.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
