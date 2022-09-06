import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeGroupPlayer,
  selectGroup,
  setGroupPlayer,
} from '../../features/group/groupSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';

export default function RequestGroupAdmission({ players }) {
  const currentUser = useSelector(selectCurrentUserDetails);
  const group = useSelector(selectGroup);

  const dispatch = useDispatch();
  const router = useRouter();
  let currentPath = router.query.groupDetail;

  const [isJoined, setIsJoined] = useState();
  const [isRequested, setIsRequested] = useState();

  const allPlayers = players.core.concat(
    players.reserve,
    players.admin,
    players.requested
  );

  useEffect(() => {
    setIsJoined(allPlayers.includes(currentUser.id));
    setIsRequested(players.requested.includes(currentUser.id));
  }, [players.requested, allPlayers]);

  const handleClick = () => {
    dispatch(
      setGroupPlayer({
        userId: currentUser.id,
        groupId: group.id,
        userStatus: 'requested',
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
      {!isJoined ? <button onClick={handleClick}>JOIN GROUP</button> : null}
      {isRequested ? (
        <div>
          <p>You have requested to join this group</p>
          <button onClick={handleCancelClick}>CANCEL REQUEST</button>
        </div>
      ) : null}
    </>
  );
}
