import { useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupsSlice';

export default function GroupContainer() {
  const currentGroup = useSelector(selectGroup);
  const isAdmin = currentGroup.status === 'admin' ? true : false;
  const groupName = currentGroup.name;

  return (
    <>
      <h2>{groupName}</h2>
    </>
  );
}
