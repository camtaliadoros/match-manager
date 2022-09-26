import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGroups } from '../../features/groups/groupsSlice';

export default function GroupCard({ groupId }) {
  const groupsData = useSelector(selectGroups);

  const [groupName, setGroupName] = useState();

  useEffect(() => {
    const currentGroup = groupsData.find((group) => group.id === groupId);
    setGroupName(currentGroup?.name);
  }, [groupsData]);

  return (
    <div className='card'>
      <h4>{groupName}</h4>
    </div>
  );
}
