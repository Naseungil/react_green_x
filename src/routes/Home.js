import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import ListGroup from "react-bootstrap/ListGroup";
import Comment from "../components/Comment";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const Home = ({ userObj }) => {
  const [comment, setComment] = useState(""); //입력하는 글 정보
  const [comments, setComments] = useState([]); //조회 된 글 배열

  const getComments = async () => {
    const q = query(
      collection(db, "comments"),
      orderBy("date", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    /*
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const commentObj = {
        ...doc.data(),
        id: doc.id,
      };
      setComments((prev) => [commentObj, ...prev]);
    });
    */
    //const commentArr = querySnapshot.docs.map(doc=>{return {...doc.data(),id:doc.id}});
    const commentArr = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setComments(commentArr);
  };
  useEffect(() => {
    getComments();
  }, []); //최초 렌더링후 실행,변동시 실행

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
        uid: userObj,
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
      <hr />
      <ListGroup>
        {comments.map((item) => {
          return (
            <Comment
              key={item.id}
              isOwener={item.id === userObj}
              commentObj={item}
            />
          );
        })}
      </ListGroup>
    </div>
  );
};

export default Home;
