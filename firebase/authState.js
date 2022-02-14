import { useDispatch } from 'react-redux';
import { updateUserStatus, resetUser, setUser } from '../features/usersSlice';
import { auth } from './clientApp';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function AuthState() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          dispatch(updateUserStatus(true));
          const userDetails = {
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            emailVerified: auth.currentUser.emailVerified,
            photoURL: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
          };
          dispatch(setUser(userDetails));
        } else {
          dispatch(resetUser());
        }
      },
      [auth]
    );
  });

  return null;
}
