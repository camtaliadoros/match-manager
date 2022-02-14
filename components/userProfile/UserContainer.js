import UserProfile from './userProfile';
import UserSettings from './UserSettings/userSettings';
import classes from './styles/userProfile.module.scss';
import { useState } from 'react';

export default function UserContainer() {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <button
        onClick={() => setClicked(false)}
        className={(clicked ? '' : 'active') + ' tab'}
      >
        Profile
      </button>
      <button
        onClick={() => setClicked(true)}
        className={(clicked ? 'active' : '') + ' tab'}
      >
        Settings
      </button>
      <div className={classes.profileCard}>
        {clicked ? <UserSettings /> : <UserProfile />}
      </div>
    </div>
  );
}
