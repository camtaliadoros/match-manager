import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGroupPlayers,
  selectGroupPlayersByStatus,
} from '../../features/group/groupSlice';
import { getPlayersData } from '../../features/users/playersSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';
import GroupPlayerActions from './GroupPlayerActions';

export default function GroupPlayerListing() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUserDetails);
  const groupPlayers = useSelector(selectGroupPlayers);
  const groupPlayersByStatus = useSelector(selectGroupPlayersByStatus);

  const isAdmin = groupPlayersByStatus.admin.includes(currentUser.id);

  const playersToFetch = groupPlayers
    .filter((player) => player.playerId !== currentUser.id)
    .map((player) => player.playerId);

  useEffect(() => {
    if (playersToFetch.length > 0) {
      dispatch(getPlayersData(playersToFetch));
    }
  }, [playersToFetch.length]);

  return (
    <>
      <h3 className='title'>Players</h3>

      {groupPlayers.map((player) => (
        <GroupPlayerActions
          key={player.playerId}
          playerId={player.playerId}
          playerStatus={player.playerStatus}
          adminView={isAdmin}
        />
      ))}

      {/* {groupPlayersByStatus.admin.map((playerId) => (
        <GroupPlayerActions
          key={playerId}
          id={playerId}
          status='admin'
          adminView={isAdmin}
        />
      ))}

      {groupPlayersByStatus.core.map((playerId) => (
        <GroupPlayerActions
          key={playerId}
          id={playerId}
          status='core'
          adminView={isAdmin}
        />
      ))}
      {groupPlayersByStatus.reserve.map((playerId) => (
        <GroupPlayerActions
          key={playerId}
          id={playerId}
          status='reserve'
          adminView={isAdmin}
        />
      ))} */}

      {isAdmin && groupPlayersByStatus.requested.length ? (
        <>
          <h3 className='title'>Requested to join</h3>
          {groupPlayersByStatus.requested.map((playerId) => (
            <GroupPlayerActions
              key={playerId}
              id={playerId}
              status='requested'
              adminView={isAdmin}
            />
          ))}
        </>
      ) : null}
    </>
  );
}
