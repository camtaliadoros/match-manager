import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectLoggedIn,
} from '../../features/userProfile/usersSlice';
import { auth } from '../../firebase/clientApp';

export default function AuthNavigation({ authClass }) {
  const router = useRouter();

  const isLoggedIn = useSelector(selectLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className={authClass}>
      {isLoggedIn && isEmailVerified ? <Link href='/'>Dashboard</Link> : null}
      {isLoggedIn ? (
        <button className='link-style' onClick={handleSignOut}>
          SIGN OUT
        </button>
      ) : (
        <Link href='/login'>REGISTER / LOG IN</Link>
      )}
    </div>
  );
}
