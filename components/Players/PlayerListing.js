import Player from './Player';

export default function PlayerListing({ type, players }) {
  if (type === 'group') {
    const corePlayers = players.core;
    const reservePlayers = players.reserve;
    const admin = players.admin;

    return (
      <>
        <h2>Players</h2>
        <Player id={admin} />
        {corePlayers.map((playerId, i) => (
          <Player key={i} id={playerId} status='core' />
        ))}
        {reservePlayers.map((playerId, i) => (
          <Player key={i} id={playerId} status='reserve' />
        ))}
      </>
    );
  } else {
    return <p>No players</p>;
  }
}
