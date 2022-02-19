import { useState } from 'react';
import { createGroup, selectIsLoading } from '../../features/group/groupsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/usersSlice';

export default function CreateGroupForm() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectIsLoading);

  const [groupName, setGroupName] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sub with real data
    const groupData = {
      id: 'group1',
      status: 'admin',
      name: groupName,
    };
    dispatch(createGroup(groupData));
    // Redirect to group page
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
    </>
  );
}
