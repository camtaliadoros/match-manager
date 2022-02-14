import { useEffect, useState } from 'react';
import Reauth from './Reauth';
import ChangePassword from './ChangePassword';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectLoading,
  selectError,
} from '../../../features/usersSlice';
import { updateUserEmail } from '../../../features/usersSlice';
import { updateEmail } from 'firebase/auth';
import { auth } from '../../../firebase/clientApp';
import ChangeEmail from './ChangeEmail';

export default function UserSettings() {
  return (
    <>
      <ChangePassword />
      <ChangeEmail />
    </>
  );
}
