import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  updateUserEmail,
  updateUserProfile,
} from '../../features/usersSlice';
import { storage } from '../../firebase/clientApp';
import { getImageExtension } from '../../utilities/helpers';
import PasswordComparison from '../auth/PasswordComparison';
import classes from './styles/userProfile.module.scss';

export default function UserProfile() {
  const user = useSelector(selectCurrentUser);
  const userPhoto = user.profile.photo;
  const userAddress = user.emailAddress;
  const userDisplayName = user.profile.name;
  const uid = user.uid;

  const dispatch = useDispatch();

  const [username, setUsername] = useState(
    userDisplayName ? userDisplayName : userAddress.split('@')[0]
  );
  const [email, setEmail] = useState(userAddress);
  const [password, setPassword] = useState('');
  const [passMatch, setPassMatch] = useState(true);
  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState(username[0]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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

    if (
      photo !== userPhoto ||
      username !== userDisplayName ||
      email !== userAddress
    ) {
      setIsUpdated(false);
    }
  }, [username, photo, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedDetails = {};

    if (username !== userDisplayName) {
      updatedDetails.displayName = username;
    }

    if (photo && photo !== userPhoto) {
      if (userPhoto) {
        const currentPhotoRef = ref(storage, userPhoto);
        deleteObject(currentPhotoRef).catch((error) => {
          setErrorMessage('Something went wrong. Please try again!');
        });
      }
      const imgType = getImageExtension(photo);
      const storagePath = `profile-photo/${uid}.${imgType}`;
      const profilePhotoRef = ref(storage, storagePath);
      uploadString(profilePhotoRef, photo, 'data_url').then((snapshot) => {
        console.log(snapshot);
      });
      updatedDetails.photoURL = storagePath;
    }
    if (username !== userDisplayName || photo !== userPhoto) {
      dispatch(updateUserProfile(updatedDetails));
    }

    if (email !== userAddress) {
      dispatch(updateUserEmail(email));
    }
    setIsLoading(false);
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
        <label htmlFor='email-address'>Email Address</label>
        <input
          type='email'
          name='email-address'
          id='email-address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordComparison
          pwd={setPassword}
          match={setPassMatch}
          label={'Change Password'}
          required={false}
        />

        {isUpdated ? (
          <p className='success-message'>Updated</p>
        ) : isLoading ? (
          <div className='spinner-container'>
            <div className='spinner'></div>
          </div>
        ) : (
          <button className='full-width' disabled={!passMatch}>
            Save
          </button>
        )}
        {errorMessage ? <p>{errorMessage}</p> : null}
      </form>
    </div>
  );
}
