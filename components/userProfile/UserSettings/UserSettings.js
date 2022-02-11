import { useState } from 'react';
import Reauth from './Reauth';
import ChangePassword from './ChangePassword';

export default function UserSettings() {
  const [isAuth, setIsAuth] = useState();

  //   if (email !== userAddress) {
  //     dispatch(updateUserEmail(email));
  //   }

  return (
    <>
      <h2>Change your password</h2>
      {isAuth ? <ChangePassword /> : <Reauth isAuth={setIsAuth} />}
    </>
  );
}
