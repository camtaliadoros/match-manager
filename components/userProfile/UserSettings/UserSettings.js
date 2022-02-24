import ChangeEmail from './ChangeEmail.js';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount.js';

export default function UserSettings() {
  return (
    <>
      <ChangePassword />
      <ChangeEmail />
      <DeleteAccount />
    </>
  );
}
