import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeGroupPlayer,
  selectGroup,
  selectGroupPlayers,
  selectGroupPlayersByStatus,
  addGroupPlayer,
} from '../../features/group/groupSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';

export default function RequestGroupAdmission() {
  const currentUser = useSelector(selectCurrentUserDetails);
  const group = useSelector(selectGroup);
  const groupPlayers = useSelector(selectGroupPlayers);
  const groupPlayersByStatus = useSelector(selectGroupPlayersByStatus);

  const dispatch = useDispatch();
  const router = useRouter();
  let currentPath = router.query.groupDetail;

  const [isRequested, setIsRequested] = useState();

  useEffect(() => {
    setIsRequested(groupPlayersByStatus.requested.includes(currentUser.id));
  }, [groupPlayersByStatus.requested.length]);

  const handleClick = () => {
    dispatch(
      addGroupPlayer({
        playerId: currentUser.id,
        groupId: group.id,
        playerStatus: 'requested',
      })
    );
  };

  const handleCancelClick = () => {
    dispatch(
      removeGroupPlayer({ playerId: currentUser.id, groupId: group.id })
    );
  };

  return (
    <>
      {isRequested ? (
        <div>
          <p>You have requested to join this group</p>
          <button onClick={handleCancelClick}>CANCEL REQUEST</button>
        </div>
      ) : (
        <button onClick={handleClick}>JOIN GROUP</button>
      )}
    </>
  );
}
