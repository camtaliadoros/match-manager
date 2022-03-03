import { useDispatch } from 'react-redux';
import {
  updateUserLoggedIn,
  resetUser,
  setUser,
  getUserProfile,
} from '../features/users/userSlice';
import { auth } from './clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function AuthState() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userDetails = {
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          uid: auth.currentUser.uid,
        };
        dispatch(setUser(userDetails));
        dispatch(updateUserLoggedIn(true));
        dispatch(getUserProfile(auth.currentUser.uid));
      } else {
        dispatch(resetUser());
      }
    });
  }, [auth.currentUser]);

  return null;
}
