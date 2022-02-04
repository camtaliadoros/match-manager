import { useDispatch } from 'react-redux';
import {
  updateUserStatus,
  updateUserId,
  updateEmailVerified,
  resetUser,
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
        dispatch(updateUserId(currentUser.uid));

        if (currentUser.emailVerified) {
          dispatch(updateEmailVerified(true));
        }
      } else {
        dispatch(resetUser());
      }
    });
  });

  return null;
}
