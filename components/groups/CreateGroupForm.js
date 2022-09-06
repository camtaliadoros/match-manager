import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  createGroup,
  groupFailedToLoad,
  groupIsFulfilled,
  groupIsLoading,
} from '../../features/group/groupSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';
import { db } from '../../firebase/clientApp';

export default function CreateGroupForm() {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUserDetails);
  const isLoading = useSelector(groupIsLoading);
  const failedToLoad = useSelector(groupFailedToLoad);
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupPath, setGroupPath] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (groupPath) {
      router.push(`/${groupPath}`);
    }
  });

  useEffect(() => {
    if (failedToLoad) {
      setErrorMessage('Something went wrong, please try again.');
    }
  }, [failedToLoad]);

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

      const adminId = currentUser.id;

      dispatch(createGroup({ groupData, adminId }));

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
