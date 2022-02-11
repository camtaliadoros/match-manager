import UserProfile from './userProfile';
import UserSettings from './UserSettings/userSettings';
import { useState } from 'react';

export default function UserContainer() {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <button
        onClick={() => setClicked(false)}
        className={clicked ? null : 'active'}
      >
        Profile
      </button>
      <button
        onClick={() => setClicked(true)}
        className={clicked ? 'active' : null}
      >
        Settings
      </button>
      {clicked ? <UserSettings /> : <UserProfile />}
    </div>
  );
}
