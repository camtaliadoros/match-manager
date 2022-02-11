import PasswordComparison from '../../auth/PasswordComparison';
import { useState } from 'react';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import { updatePassword } from 'firebase/auth';

export default function ChangePassword() {
  const [password, setPassword] = useState();
  const [passMatch, setPassMatch] = useState(true);
  const [passChanged, setPassChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(auth.currentUser, password);
      setPassChanged(true);
    } catch (error) {
      setErrorMessage(handleAuthError(error));
    }
  };

  return (
    <>
      <form>
        <PasswordComparison
          pwd={setPassword}
          match={setPassMatch}
          label={'Change Password'}
          required={false}
        />
        {passChanged ? (
          <p>PASSWORD CHANGED</p>
        ) : (
          <button onClick={handleSubmit} disabled={!passMatch}>
            SAVE
          </button>
        )}
        {errorMessage ? <p>{errorMessage}</p> : null}
      </form>
    </>
  );
}
