import PasswordComparison from '../../auth/PasswordComparison';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/clientApp';
import { handleAuthError } from '../../../utilities/authErrorHandler';
import { updatePassword } from 'firebase/auth';

export default function ChangePassword() {
  const [password, setPassword] = useState();
  const [passMatch, setPassMatch] = useState(true);
  const [passChanged, setPassChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setPassChanged(false);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updatePassword(auth.currentUser, password);
      setPassChanged(true);
      setIsLoading(false);
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
          <p className='success-message'>PASSWORD CHANGED</p>
        ) : (
          <button onClick={handleSubmit} disabled={!passMatch}>
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'></div>
              </div>
            ) : (
              'SAVE'
            )}
          </button>
        )}
        {errorMessage ? <p>{errorMessage}</p> : null}
      </form>
    </>
  );
}
