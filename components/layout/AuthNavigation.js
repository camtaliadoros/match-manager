import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  selectEmailVerified,
  selectUserIsLoggedIn,
} from '../../features/users/userSlice';
import { auth } from '../../firebase/clientApp';

export default function AuthNavigation() {
  const router = useRouter();

  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const isEmailVerified = useSelector(selectEmailVerified);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className='row'>
      {isLoggedIn && isEmailVerified ? (
        <Link href='/dashboard'>Dashboard</Link>
      ) : null}
      {isLoggedIn ? (
        <button className='link-style' onClick={handleSignOut}>
          SIGN OUT
        </button>
      ) : (
        <Link href='/login'>REGISTER / LOG IN</Link>
      )}
    </nav>
  );
}
