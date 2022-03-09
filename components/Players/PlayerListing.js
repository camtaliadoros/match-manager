import Player from './Player';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupSlice';
import { getGroupPlayers } from '../../features/users/playersSlice';
import { useEffect } from 'react';
import { selectCurrentUser } from '../../features/users/userSlice';

export default function PlayerListing({ players }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const corePlayers = players.core;
  const reservePlayers = players.reserve;
  const adminPlayers = players.admin;
  const pendingPlayers = players.requested;

  const isAdmin = adminPlayers.includes(currentUser.id);

  const allPlayers = corePlayers.concat(
    reservePlayers,
    adminPlayers,
    pendingPlayers
  );

  const playersToFetch = allPlayers.filter(
    (player) => player !== currentUser.id
  );

  useEffect(() => {
    if (playersToFetch) {
      dispatch(getGroupPlayers(playersToFetch));
    }
  }, [playersToFetch]);

  return (
    <>
      <h3 className='title'>Players</h3>

      {adminPlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='admin' />
      ))}

      {corePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='core' />
      ))}
      {reservePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='reserve' />
      ))}

      {isAdmin ? (
        <>
          <h3>Requested to join</h3>
          {pendingPlayers.map((playerId, i) => (
            <Player key={i} id={playerId} status='requested' />
          ))}
        </>
      ) : null}
    </>
  );
}
