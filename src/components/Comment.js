import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Form from "react-bootstrap/Form";

const Comment = ({ commentObj, isOwner }) => {
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState(commentObj.comment);

  const deleteComment = async () => {
    const deleteConfirm = window.confirm("정말 삭제할까요?");
    if (deleteConfirm) {
      await deleteDoc(doc(db, "comments", commentObj.id));
    }
  };
  const toggleEditMode = () => {
    setEdit((prev) => !prev);
  };
  const onChange = (e) => {
    //let value = e.target.value;
    const {
      target: { value },
    } = e; //비구조할당
    setComment(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const commentRef = doc(db, "comments", commentObj.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(commentRef, {
      comment: comment,
    });
    setEdit(false);
  };

  return (
    <ListGroup.Item>
      <div className="d-flex flex-column">
        {edit ? (
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Control
                type="text"
                value={comment}
                onChange={onChange}
                placeholder="글을 입력해주세요"
              />
            </Form.Group>
            <div className="d-flex gap-1">
              <Button type="submit" variant="success">
                입력
              </Button>
              <Button type="button" variant="danger" onClick={toggleEditMode}>
                취소
              </Button>
            </div>
          </Form>
        ) : (
          <>
            {commentObj.comment}
            {commentObj.image && (
              <div>
                <img src={commentObj.image} alt="" width="100" />
              </div>
            )}
            {isOwner && (
              <div className="d-flex gap-1 align-self-end">
                <Button variant="secondary" onClick={toggleEditMode} size="sm">
                  수정
                </Button>
                <Button onClick={deleteComment} variant="danger" size="sm">
                  삭제
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default Comment;
