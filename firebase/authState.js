import { useDispatch } from 'react-redux';
import {
  updateUserStatus,
  resetUser,
  setUser,
  getUserProfile,
} from '../features/usersSlice';
import { auth } from './clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function AuthState() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(updateUserStatus(true));
        dispatch(getUserProfile(auth.currentUser.uid));
        const userDetails = {
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          uid: auth.currentUser.uid,
        };
        dispatch(setUser(userDetails));
      } else {
        dispatch(resetUser());
      }
    });
  }, [auth.currentUser]);

  return null;
}
