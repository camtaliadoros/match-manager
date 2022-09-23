import UserProfile from './userProfile';
import UserSettings from './UserSettings/userSettings';
import classes from './styles/userProfile.module.scss';
import { useState } from 'react';

export default function UserContainer() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`${classes.profileContainer} details-wrapper`}>
      <button
        onClick={() => setIsActive(false)}
        className={(isActive ? '' : 'active') + ' tab'}
      >
        Profile
      </button>
      <button
        onClick={() => setIsActive(true)}
        className={(isActive ? 'active' : '') + ' tab'}
      >
        Settings
      </button>
      <div className={classes.profileCard}>
        {isActive ? <UserSettings /> : <UserProfile />}
      </div>
    </div>
  );
}
