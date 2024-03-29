import { collection, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, ref, uploadString } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUserDetails,
  updateUserProfile,
  selectUserIsLoading,
} from '../../features/users/userSlice';
import { db, storage } from '../../firebase/clientApp';
import { getImageExtension } from '../../utilities/helpers';
import ProfilePhoto from '../shared/profilePhoto/ProfilePhoto';
import classes from './styles/userProfile.module.scss';
import LoadingState from '../shared/LoadingState';

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUserDetails);
  const dataIsLoading = useSelector(selectUserIsLoading);

  const currentPhoto = user.photo;
  const uid = user.id;

  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState();
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setUsername(user.username);
  }, [user.username]);

  useEffect(() => {
    if (user.photo) {
      setPhoto(user.photo);
    }
  }, [user.photo]);

  useEffect(() => {
    setErrorMessage('');
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDetails = {};

    let usernameExists;
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      usernameExists = doc.data();
    });
    if (username !== user.username && usernameExists) {
      setErrorMessage(
        'This username is already taken. Please choose a different one.'
      );
    } else {
      if (username !== user.username) {
        updatedDetails.username = username;
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
        uploadString(profilePhotoRef, photo, 'data_url');
        updatedDetails.photo = storagePath;
      }
      if (username !== user.username || photo !== currentPhoto) {
        dispatch(updateUserProfile(updatedDetails));
      }

      setIsLoading(false);
      setIsUpdated(true);
    }
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

  if (dataIsLoading) {
    return <LoadingState />;
  }
  return (
    <div className='wrapper'>
      <h1>Create your profile</h1>
      <div className={classes.profilePhotoWrapper}>
        <ProfilePhoto username={username} userPhoto={photo} />
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
        {errorMessage ? (
          <div className='error'>
            <p className='error-message'>{errorMessage}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
