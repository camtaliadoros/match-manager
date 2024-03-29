import { useState, useEffect } from 'react';

export default function PasswordComparison({ setPwd, match, label, required }) {
  const [password, setPassword] = useState('');
  const [passVal, setPassVal] = useState('');
  const [passMatch, setPassMatch] = useState(false);
  const [passAlert, setPassAlert] = useState(false);

  useEffect(() => {
    setPassMatch(password.length > 0 && passVal === password);
    setPassAlert(!(passMatch || passVal.length === 0));

    if (password) {
      setPwd(password);
    } else {
      setPassVal('');
    }

    match(passMatch);
  }, [passVal, passMatch, password]);

  return (
    <>
      <label htmlFor='password'>{label}</label>
      <input
        id='new-password'
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
