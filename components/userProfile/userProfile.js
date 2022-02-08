import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserProfile,
  selectCurrentUser,
} from '../../features/usersSlice';
import classes from './styles/userProfile.module.scss';
import { auth } from '../../firebase/clientApp';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../firebase/clientApp';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getImageExtension } from '../../utilities/helpers';

// To Do
// - Connect to database
// - Photo upload functionality
// - Check if username is already taken

export default function UserProfile() {
  const user = useSelector(selectCurrentUser);
  const userPhoto = user.profile.photo;
  const userAddress = user.emailAddress;
  const userDisplayName = user.profile.name;
  const uid = user.uid;

  const [username, setUsername] = useState(
    userDisplayName ? userDisplayName : userAddress.split('@')[0]
  );
  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState(userDisplayName[0]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (userPhoto) {
      getDownloadURL(ref(storage, userPhoto)).then((url) => setPhoto(url));
    }
  }, []);

  useEffect(() => {
    setLetterDisplay(username[0]);
    if (!username) {
      setLetterDisplay('?');
    }

    if (photo !== userPhoto || username !== userDisplayName) {
      setIsUpdated(false);
    }
  }, [username, photo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDetails = {};

    if (username !== userDisplayName) {
      updatedDetails.displayName = username;
    }

    if (photo !== userPhoto) {
      const imgType = getImageExtension(photo);
      const storagePath = `profile-photo/${uid}.${imgType}`;
      const profilePhotoRef = ref(storage, storagePath);
      uploadString(profilePhotoRef, photo, 'data_url').then((snapshot) => {
        console.log(snapshot);
      });
      updatedDetails.photoURL = storagePath;
    }
    if (username !== userDisplayName || photo !== userPhoto) {
      await updateProfile(auth.currentUser, updatedDetails);
    }

    setIsUpdated(true);
  };

  const handlePhotoChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
        {isUpdated ? (
          <p>Updated</p>
        ) : (
          <button className='full-width'>Save</button>
        )}
      </form>
    </div>
  );
}
