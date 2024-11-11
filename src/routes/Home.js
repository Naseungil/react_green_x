import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Home = () => {
  const [comment, setComment] = useState("");
  const onChange = (e) => {
    //let value = e.target.value;
    const {
      target: { value },
    } = e; //비구조할당
    setComment(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: comment,
        date: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="comment">
          <Form.Control
            type="text"
            onChange={onChange}
            placeholder="글을 입력해주세요"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          입력
        </Button>
      </Form>
    </div>
  );
};

export default Home;
