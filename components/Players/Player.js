import classes from './players.module.scss';

export default function Player() {
  const photoURL = '';
  return (
    <div>
      <div className={classes.profileIcon}>
        <img src={photoURL} />
      </div>
      <p>Player Name</p>
    </div>
  );
}
