import Player from './Player';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupSlice';
import { getGroupPlayers } from '../../features/users/playersSlice';
import { useEffect } from 'react';
import { selectCurrentUser } from '../../features/users/userSlice';

export default function PlayerListing({ players }) {
  const dispatch = useDispatch();
  const group = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);

  const corePlayers = players.core;
  const reservePlayers = players.reserve;
  const adminPlayers = players.admin;
  const pendingPlayers = players.requested;

  const allPlayers = corePlayers.concat(
    reservePlayers,
    adminPlayers,
    pendingPlayers
  );

  // const playersToFetch = allPlayers.filter(
  //   (player) => player === currentUser.id
  // );

  const playersToFetch = [
    'p1',
    'p2',
    'p3',
    'p4',
    'p5',
    'p6',
    'p7',
    'p8',
    'p9',
    'p10',
    'p11',
    'p12',
  ];

  useEffect(() => {
    dispatch(getGroupPlayers(playersToFetch));
  }, []);

  return (
    <>
      <h2>Players</h2>
      {adminPlayers.map((playerId, i) => {
        <Player key={i} id={playerId} status='admin' />;
      })}

      {corePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='core' />
      ))}
      {reservePlayers.map((playerId, i) => (
        <Player key={i} id={playerId} status='reserve' />
      ))}
    </>
  );
}
