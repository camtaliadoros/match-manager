import ChangeEmail from './ChangeEmail.js';
import ChangePassword from './ChangePassword';

export default function UserSettings() {
  return (
    <>
      <ChangePassword />
      <ChangeEmail />
    </>
  );
}
