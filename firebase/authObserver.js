import { auth } from '../components/auth/UserAuth';
import { useDispatch } from 'react-redux';
import { updateUserStatus, updateUserId } from '../features/usersSlice';
import { useRouter } from 'next/router';

const dispatch = useDispatch();
const router = useRouter();

export const authChangeObserver = async () => {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            dispatch(updateUserStatus(true));
            dispatch(updateUserId(currentUser.uid));
        } else {
            router.push('/');
        }
      });
}