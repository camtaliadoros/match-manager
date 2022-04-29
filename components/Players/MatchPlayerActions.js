import PlayerDetails from './PlayerDetails';
import classes from './players.module.scss';

export default function MatchPlayerActions({ player }) {
  const id = player.playerId;

  return (
    <div className={classes.playerRow}>
      <PlayerDetails id={id} />
    </div>
  );
}
