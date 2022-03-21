import Player from './Player';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupSlice';
import { getGroupPlayers } from '../../features/users/playersSlice';
import { useEffect, useState } from 'react';
import { selectCurrentUser } from '../../features/users/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function PlayerListing({ players }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [isEditing, setIsEditing] = useState(false);

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
    if (playersToFetch.length > 0) {
      dispatch(getGroupPlayers(playersToFetch));
    }
  }, [playersToFetch]);

  const handleClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div>
        <h3 className='title'>Players</h3>
        {isAdmin ? (
          isEditing ? (
            <button onClick={handleClick}>SAVE</button>
          ) : (
            <button className='link-style' onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          )
        ) : null}
      </div>

      {adminPlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='admin' adminView={isAdmin} />
      ))}

      {corePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='core' adminView={isAdmin} />
      ))}
      {reservePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='reserve' adminView={isAdmin} />
      ))}

      {isAdmin ? (
        <>
          <h3 className='title'>Requested to join</h3>
          {pendingPlayers.map((playerId, i) => (
            <Player
              key={i}
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
