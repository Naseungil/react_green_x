import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { authService } from "../firebase";
console.log(authService);

const Profile = () => {
  const user = authService.currentUser;
  const profilePath = `${process.env.PUBLIC_URL}/profile_icon.svg`;
  const [profile, setProfile] = useState(profilePath);

  const navigate = useNavigate();
  const onLogoutClick = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        alert("로그아웃 완료");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        alert(error);
      });
  };

  const updateLogo = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage(); //파일업로드 관련 함수 초기화
    const storageRef = ref(storage, `profile/${user.uid}`); //파일이 저장될 위치, 이름지정

    const result = await uploadBytes(storageRef, file); //업로드후 결과를 result에 할당

    const profileURL = await getDownloadURL(result.ref); //업로드된 이미지의 절대 경로

    setProfile(profileURL); //새이미지로 프로필 교체

    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      photoURL: profileURL,
    });
  };

  useEffect(() => {
    user.photoURL !== null && setProfile(user.photoURL);
  }, []); //최초한번 실행, 값이 변경되면 실행

  return (
    <div className="container">
      <h1>Profile Page</h1>
      <div className="profile">
        <img src={profile} alt="" />
      </div>

      <input
        type="file"
        className="hidden"
        accept="image/*"
        name="profile"
        id="profile"
        onChange={updateLogo}
      />

      <label htmlFor="profile" className="btn btn-primary">
        프로필 이미지 변경
      </label>

      <hr />
      <Button variant="primary" onClick={onLogoutClick}>
        로그아웃
      </Button>
    </div>
  );
};

export default Profile;
