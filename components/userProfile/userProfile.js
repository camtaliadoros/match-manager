import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserProfile,
  selectCurrentUser,
} from '../../features/usersSlice';
import classes from './styles/userProfile.module.scss';
import Image from 'next/image';
import { auth } from '../../firebase/clientApp';
import { updateProfile } from 'firebase/auth';

// To Do
// - Connect to database
// - Photo upload functionality
// - Check if username is already taken

export default function UserProfile() {
  const currentUser = useSelector(selectCurrentUser);
  const userPhoto = currentUser.profile.photo;
  const userAddress = currentUser.emailAddress;
  const userDisplayName = currentUser.profile.name;

  const [username, setUsername] = useState(
    userDisplayName ? userDisplayName : userAddress.split('@')[0]
  );
  const [photo, setPhoto] = useState(userPhoto);
  const [letterDisplay, setLetterDisplay] = useState(userDisplayName[0]);

  useEffect(() => {
    setLetterDisplay(username[0]);
    if (!username) {
      setLetterDisplay('?');
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(auth.currentUser, {
      displayName: username,
    });
  };

  const handlePhotoChange = (file) => {
    const reader = new FileReader();
    reader.onload = function () {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='wrapper'>
      <h1>Create your profile</h1>
      <div className={classes.imageContainer}>
        {photo ? (
          <div
            className={classes.profilePhoto}
            style={{ backgroundImage: `url('${photo}')` }}
          ></div>
        ) : (
          <p>{letterDisplay}</p>
        )}
      </div>
      <input
        className={classes.fileInput}
        type='file'
        id='avatar'
        name='avatar'
        accept='image/png, image/jpeg'
        onChange={(e) => handlePhotoChange(e.target.files[0])}
      />
      <form onSubmit={handleSubmit}>
        <label htmlFor='display-name'>Username</label>
        <input
          type='text'
          name='display-name'
          id='display-name'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button className='full-width'>Save</button>
      </form>
    </div>
  );
}
