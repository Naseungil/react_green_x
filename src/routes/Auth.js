import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const auth = getAuth();

  const onChange = (e) => {
    /*
     setEmail(e.target.email);
     setPassword(e.target.password); <- 이렇게 쓰면 안됨

    if (e.target.name === "email") {
      setEmail(e.target.email);
    } else if (e.target.name === "password") {
      setPassword(e.target.password);
    }
    */

    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (newAccount) {
      //회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //계정생성완료후, 로그인 완료
          const user = userCredential.user; //생성된 계정의 유저정보 확인
          console.log(user);
        })
        .catch((error) => {
          //const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } else {
      //로그인
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onGoogleSignin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        setError(errorMessage);
        console.log(email, credential);
      });
  };
  return (
    <div className="container">
      <h1>{newAccount ? "회원가입" : "로그인"}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            onChange={onChange}
            placeholder="name@example.com"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginPW">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" onChange={onChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {newAccount ? "회원가입" : "로그인"}
        </Button>
      </Form>
      <div>{error}</div>
      <hr />
      {newAccount ? (
        <Button variant="outline-info" onClick={onGoogleSignin}>
          구글로 회원가입
        </Button>
      ) : (
        <Button variant="info" onClick={onGoogleSignin}>
          구글로 로그인
        </Button>
      )}
      <hr />
      <Button variant="secondary" onClick={toggleAccount}>
        {newAccount ? "로그인으로 전환" : "회원가입으로 전환"}
      </Button>
    </div>
  );
};

export default Auth;
