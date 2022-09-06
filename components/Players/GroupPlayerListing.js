import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayersData } from '../../features/users/playersSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';
import GroupPlayerActions from './GroupPlayerActions';

export default function GroupPlayerListing({ players }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUserDetails);

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
      dispatch(getPlayersData(playersToFetch));
    }
  }, [playersToFetch.length]);

  return (
    <>
      <h3 className='title'>Players</h3>

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

      {isAdmin && pendingPlayers.length && (
        <>
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
          )
        </>
      )}
    </>
  );
}
