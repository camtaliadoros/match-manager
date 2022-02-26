import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { createGroup, selectIsLoading } from '../../features/group/groupsSlice';
import { selectCurrentUser } from '../../features/usersSlice';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export default function CreateGroupForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);

  const [groupName, setGroupName] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let nameExists;
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('name', '==', groupName));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    querySnapshot.forEach((doc) => {
      nameExists = doc.data();
    });

    if (nameExists) {
      setErrorMessage('This group name already exists');
    } else {
      const groupId = uuidv4();

      const groupData = {
        id: groupId,
        name: groupName,
      };
      dispatch(createGroup(groupData));
      // Redirect to group page
      setErrorMessage('Group created');
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
