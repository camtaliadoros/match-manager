import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsAdmin } from '../../features/group/groupSlice';
import {
  removeMatchPlayer,
  selectCurrentMatch,
  togglePaymentStatus,
} from '../../features/matches/matchSlice';
import PlayerDetails from './PlayerDetails';
import classes from './players.module.scss';

export default function MatchPlayerActions({ player }) {
  const id = player.playerId;
  const paymentStatus = player.paymentStatus;
  const dispatch = useDispatch();

  const isAdmin = useSelector(selectUserIsAdmin);
  const match = useSelector(selectCurrentMatch);

  const handleClick = () => {
    const dataToUpdate = {
      matchId: match.id,
      playerId: id,
      paymentStatus: !paymentStatus,
    };

    dispatch(togglePaymentStatus(dataToUpdate));
  };

  const handleDelete = () => {
    dispatch(removeMatchPlayer({ matchId: match.id, playerId: id }));
  };

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
          <button onClick={handleClick} className='link-style'>
            <FontAwesomeIcon
              icon={faMoneyBill}
              className={`${
                paymentStatus
                  ? classes.playerPaidIcon
                  : classes.playerNotPaidIcon
              }`}
            />
          </button>
          <button className='link-style' onClick={handleDelete}>
            <FontAwesomeIcon icon={faCircleXmark} className='icon' />
          </button>
        </div>
      </div>
    );
  }
}
