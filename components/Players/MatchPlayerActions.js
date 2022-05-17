import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { selectUserIsAdmin } from '../../features/group/groupSlice';
import PlayerDetails from './PlayerDetails';
import classes from './players.module.scss';

export default function MatchPlayerActions({ player }) {
  const id = player.playerId;

  const isAdmin = useSelector(selectUserIsAdmin);

  if (!isAdmin) {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails id={id} />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails id={id} />
        <div>
          <button className='link-style'>
            <FontAwesomeIcon icon={faMoneyBill} className='icon' />
          </button>
        </div>
      </div>
    );
  }
}
