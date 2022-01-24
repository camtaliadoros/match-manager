import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./usersSlice";
import { selectUserProfile } from "./usersSlice";

export default function UserProfile() {
    const userProfile = useSelector(selectUserProfile);

  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
//   const [photo, setPhoto] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(updateUserProfile({
        firstName,
        lastName,
        // photo
    }))
  }

  return (
    <>
      <h1>Create your profile</h1>
      <form>
      <input type="file"
       id="avatar" name="avatar"
       accept="image/png, image/jpeg"/>
       <label for='firstName'>First Name</label>
       <input 
       type="text"
       name="firstName" id='firstName'
       onChange={(e) => setFirstName(e.target.value)}/>
              <label for='lastName'>First Name</label>
       <input 
       type="text"
       name="lastName" id='lastName'
       onChange={(e) => setLastName(e.target.value)}/>
    <button onClick={handleSubmit}>Save</button>

      </form>
    </>
  );
}
