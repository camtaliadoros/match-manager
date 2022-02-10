import { useState, useEffect } from 'react';
import classes from './Auth.module.scss';

export default function PasswordComparison({ pwd, match, label, required }) {
  const [password, setPassword] = useState('');
  const [passVal, setPassVal] = useState('');
  const [passMatch, setPassMatch] = useState(false);
  const [passAlert, setPassAlert] = useState(false);

  useEffect(() => {
    setPassMatch(passVal === password);
    setPassAlert(!(passMatch || passVal.length === 0));
    password ? pwd(password) : null;
    !password ? setPassVal('') : null;
    match(passMatch);
  }, [passVal, passMatch, password]);

  return (
    <>
      <label htmlFor='password'>{label}</label>
      <input
        id='password'
        type='password'
        name='password'
        aria-label='password'
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        minLength='8'
        required={required}
      />
      {password ? (
        <>
          <label htmlFor='passval'>Confirm Password</label>
          <input
            id='passval'
            type='password'
            name='passVal'
            aria-label='password-validation'
            value={passVal}
            onChange={(e) => setPassVal(e.currentTarget.value)}
            required
          />
        </>
      ) : null}

      {passAlert ? (
        <p className='error-message'>Your password does not match</p>
      ) : null}
    </>
  );
}
