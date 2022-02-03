import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./usersSlice";
import { selectUserProfile } from "./usersSlice";
import classes from "./styles/userProfile.module.scss";
import Image from "next/image";


export default function UserProfile() {
  const userProfile = useSelector(selectUserProfile);

  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [imgDisplay, setImgDisplay] = useState(userProfile.photo);

  useEffect(() => {
    if (!userProfile.photo) {
      if (firstName && lastName) {
        const initials = firstName[0] + lastName[0]
        setImgDisplay(initials);

      } else if (userProfile.emailAddress) {
        const emailInitial = userProfile.emailAddress[0];
        console.log('email initial' + emailInitial)
        setImgDisplay(emailInitial);
      } else {
        setImgDisplay('?');
      }
    }
  }, [userProfile.photo]);
  

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateUserProfile({
        firstName,
        lastName,
        // photo
      })
    );
  };

  return (
    <>
      <h1>Create your profile</h1>
      <div className={classes.profilePhoto}>
         {userProfile.photo ? <Image src={imgDisplay} layout="fill" /> : <p>{imgDisplay}</p>}
      </div>
      <input
        className={classes.fileInput}
        type="file"
        id="avatar"
        name="avatar"
        accept="image/png, image/jpeg"
        onChange={(e) => setImgDisplay(e.target.value)}
      />
      <form>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">First Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          onChange={(e) => setLastName(e.target.value)}
        />
        <button className="full-width" onClick={handleSubmit}>Save</button>
      </form>
    </>
  );
}
