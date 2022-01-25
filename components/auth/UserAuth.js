import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  updateUserId,
  updateUserStatus,
  updateEmailVerified,
  resetUser,
} from "../../features/usersSlice";
import { auth } from "../../firebase/clientApp";

export default function UserAuth() {
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      dispatch(updateUserStatus(true));
      dispatch(updateUserId(currentUser.uid));
      if (currentUser.emailVerified) {
        dispatch(updateEmailVerified(true));
      }
    } else {
      dispatch(resetUser());
    }
  });
  return null;
}
