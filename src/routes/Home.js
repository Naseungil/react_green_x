import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

const Home = () => {
  return (
    <div className="container">
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="글을 입력해주세요" />
        </Form.Group>
        <Button variant="primary">입력</Button>
      </Form>
    </div>
  );
};

export default Home;
