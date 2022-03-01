import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  createGroup,
  groupFailedToLoad,
  groupIsFulfilled,
  groupIsLoading,
  setGroupPlayer,
} from '../../features/group/groupSlice';
import { selectCurrentUser } from '../../features/usersSlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { useRouter } from 'next/router';

export default function CreateGroupForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(groupIsLoading);
  const isFulfilled = useSelector(groupIsFulfilled);
  const failedToLoad = useSelector(groupFailedToLoad);
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupPath, setGroupPath] = useState('/');
  const [errorMessage, setErrorMessage] = useState();

  if (isFulfilled) {
    router.push(`/dashboard/${groupPath}`);
  }

  if (failedToLoad) {
    setErrorMessage('Something went wrong, please try again.');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let nameExists;
    const path = groupName.toLowerCase().replace(' ', '-');
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('path', '==', path));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      nameExists = doc.data();
    });

    if (nameExists) {
      setErrorMessage('This group name already exists');
    } else {
      const groupId = uuidv4();
      const path = groupName.toLowerCase().replace(' ', '-');

      const groupData = {
        id: groupId,
        name: groupName,
        path: path,
      };

      const userData = {
        groupId: groupId,
        groupPath: path,
        userId: currentUser.uid,
        userStatus: 'admin',
      };

      dispatch(createGroup(groupData));
      dispatch(setGroupPlayer(userData));

      setGroupPath(path);
    }
  };

  return (
    <>
      <h2>Create Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          id='group-name'
          aria-label='group-name'
          value={groupName}
          placeholder='Group Name'
          onChange={(e) => setGroupName(e.currentTarget.value)}
          required
        />
        {isLoading ? (
          <div className='spinner-container'>
            <div className='spinner'></div>
          </div>
        ) : (
          <button>CREATE GROUP</button>
        )}
      </form>
      <p className='error-message'>{errorMessage}</p>
    </>
  );
}
