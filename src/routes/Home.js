import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import ListGroup from "react-bootstrap/ListGroup";
import Comment from "../components/Comment";
import { getStorage, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

const Home = ({ userObj }) => {
  const [comment, setComment] = useState(""); //입력하는 글 정보
  const [comments, setComments] = useState([]); //조회 된 글 배열
  const [attachment, setAttachment] = useState();

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  const getComments = async () => {
    /*
    const q = query(
      collection(db, "comments"),
      orderBy("date", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
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
    /*
    const commentArr = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    */

    const q = query(
      collection(db, "comments"),
      orderBy("date", "desc"),
      limit(5)
    );
    onSnapshot(q, (querySnapshot) => {
      const commentArr = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setComments(commentArr);
    });
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
      document.querySelector("#comment").value = "";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const onFileChange = (e) => {
    /*
    const { target: {files} } = e;
    const theFile = files[0];
    */
    const theFile = e.target.files[0];
    const reader = new FileReader();
    /*
    reader.addEventListener(
      "load",
      (e) => {
        console.log(e.target.result)
     
      },
      false
    );
  */
    reader.onloadend = (e) => {
      setAttachment(e.target.result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearFile = () => {
    setAttachment(null);
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

        <Form.Group controlId="formFileSm" className="mb-3">
          <Form.Label>이미지</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            size="sm"
            onChange={onFileChange}
          />
        </Form.Group>

        {attachment && (
          <div className="mb-1 d-flex gap-1">
            <img src={attachment} alt="" width="50" />
            <Button
              onClick={onClearFile}
              type="button"
              variant="danger"
              size="sm"
            >
              취소
            </Button>
          </div>
        )}

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
              isOwner={item.uid === userObj}
              commentObj={item}
            />
          );
        })}
      </ListGroup>
    </div>
  );
};

export default Home;
