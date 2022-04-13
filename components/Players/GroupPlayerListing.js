import GroupPlayerActions from './GroupPlayerActions';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupPlayers } from '../../features/users/playersSlice';
import { useEffect, useState } from 'react';
import { selectCurrentUser } from '../../features/users/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function GroupPlayerListing({ players }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [isEditing, setIsEditing] = useState(false);

  const [corePlayers, setCorePlayers] = useState(players.core);
  const [reservePlayers, setReservePlayers] = useState(players.reserve);
  const [adminPlayers, setAdminPlayers] = useState(players.admin);
  const [pendingPlayers, setPendingPlayers] = useState(players.requested);

  useEffect(() => {
    setCorePlayers(players.core);
    setReservePlayers(players.reserve);
    setAdminPlayers(players.admin);
    setPendingPlayers(players.requested);
  }, [players]);

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
  }, [playersToFetch.length]);

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
        <GroupPlayerActions
          key={i}
          id={playerId}
          status='admin'
          adminView={isAdmin}
        />
      ))}

      {corePlayers.map((playerId, i) => (
        <GroupPlayerActions
          key={i}
          id={playerId}
          status='core'
          adminView={isAdmin}
        />
      ))}
      {reservePlayers.map((playerId, i) => (
        <GroupPlayerActions
          key={i}
          id={playerId}
          status='reserve'
          adminView={isAdmin}
        />
      ))}

      {isAdmin ? (
        <>
          {pendingPlayers.length > 0 ? (
            <div>
              <h3 className='title'>Requested to join</h3>
              {pendingPlayers.map((playerId, i) => (
                <GroupPlayerActions
                  key={i}
                  id={playerId}
                  status='requested'
                  adminView={isAdmin}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}
