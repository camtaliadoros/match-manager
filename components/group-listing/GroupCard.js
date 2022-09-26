import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGroups } from '../../features/groups/groupsSlice';

export default function GroupCard({ groupId }) {
  const groupsData = useSelector(selectGroups);

  const [groupName, setGroupName] = useState();
  const [groupPath, setGroupPath] = useState();

  useEffect(() => {
    const currentGroup = groupsData.find((group) => group.id === groupId);
    setGroupName(currentGroup?.name);
    setGroupPath(currentGroup?.path);
  }, [groupsData]);

  return (
    <Link href={`../${groupPath}`}>
      <div className='card'>
        <h4>{groupName}</h4>
      </div>
    </Link>
  );
}
