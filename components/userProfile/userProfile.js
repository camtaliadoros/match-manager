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
  updateUserProfile,
} from '../../features/usersSlice';
import { storage } from '../../firebase/clientApp';
import { getImageExtension } from '../../utilities/helpers';
import classes from './styles/userProfile.module.scss';

// To be replaced with database data

export default function UserProfile() {
  const user = useSelector(selectCurrentUser);
  const currentPhoto = user.profile.photo;
  const currentUsername = user.profile.name;
  const userAddress = user.emailAddress;
  const uid = user.uid;

  const dispatch = useDispatch();

  const [username, setUsername] = useState(
    currentUsername ? currentUsername : userAddress.split('@')[0]
  );

  const [photo, setPhoto] = useState();
  const [letterDisplay, setLetterDisplay] = useState(username[0]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (currentPhoto) {
      getDownloadURL(ref(storage, currentPhoto)).then((url) => setPhoto(url));
    }
  }, []);

  useEffect(() => {
    setLetterDisplay(username[0]);
    if (!username) {
      setLetterDisplay('?');
    }

    if (photo !== currentPhoto || username !== currentUsername) {
      setIsUpdated(false);
    }
  }, [username, photo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedDetails = {};

    if (username !== currentUsername) {
      updatedDetails.displayName = username;
    }

    if (photo && photo !== currentPhoto) {
      if (currentPhoto) {
        const currentPhotoRef = ref(storage, currentPhoto);
        deleteObject(currentPhotoRef).catch((error) => {
          setErrorMessage('Something went wrong. Please try again!');
        });
      }
      const imgType = getImageExtension(photo);
      const storagePath = `profile-photo/${uid}.${imgType}`;
      const profilePhotoRef = ref(storage, storagePath);
      uploadString(profilePhotoRef, photo, 'data_url').then((snapshot) => {});
      updatedDetails.photoURL = storagePath;
    }
    if (username !== currentUsername || photo !== currentPhoto) {
      dispatch(updateUserProfile(updatedDetails));
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

        {isUpdated ? (
          <p className='success-message'>Updated</p>
        ) : isLoading ? (
          <div className='spinner-container'>
            <div className='spinner'></div>
          </div>
        ) : (
          <button className='full-width' disabled={isLoading}>
            Save
          </button>
        )}
        {errorMessage ? <p>{errorMessage}</p> : null}
      </form>
    </div>
  );
}
