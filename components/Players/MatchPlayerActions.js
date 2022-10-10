import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsAdmin } from '../../features/group/groupSlice';
import {
  removeMatchPlayer,
  selectCurrentMatch,
  selectMatchPlayersByStatus,
  togglePaymentStatus,
  updatePlayerMatchStatus,
} from '../../features/matches/matchSlice';
import PlayerDetails from './PlayerDetails';
import classes from './players.module.scss';

export default function MatchPlayerActions({ player }) {
  const id = player.playerId;
  const playerStatus = player.playerStatus;
  const paymentStatus = player.paymentStatus;
  const dispatch = useDispatch();

  const isAdmin = useSelector(selectUserIsAdmin);
  const match = useSelector(selectCurrentMatch);
  const playersByStatus = useSelector(selectMatchPlayersByStatus);

  const handleTogglePaymentClick = () => {
    const dataToUpdate = {
      matchId: match.id,
      playerId: id,
      paymentStatus: !paymentStatus,
    };

    dispatch(togglePaymentStatus(dataToUpdate));
  };

  const handleAcceptClick = () => {
    const playerToUpdate = {
      playerId: id,
      matchId: match.id,
    };

    if (playersByStatus?.playing.length >= match.numOfPlayers) {
      playerToUpdate.newStatus = 'waitlist';
    } else {
      playerToUpdate.newStatus = 'playing';
    }

    dispatch(updatePlayerMatchStatus(playerToUpdate));
  };

  const handleDelete = () => {
    dispatch(removeMatchPlayer({ matchId: match.id, playerId: id }));
  };

  if (!isAdmin) {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails playerId={id} />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className={classes.playerRow}>
        <PlayerDetails playerId={id} />
        <div className={classes.actionButtons}>
          {playerStatus !== 'requested' && (
            <button onClick={handleTogglePaymentClick} className='link-style'>
              <FontAwesomeIcon
                icon={faMoneyBill}
                className={`${
                  paymentStatus
                    ? classes.playerPaidIcon
                    : classes.playerNotPaidIcon
                }`}
              />
            </button>
          )}
          {playerStatus === 'requested' && (
            <button
              onClick={handleAcceptClick}
              className={classes.playerStatusButton}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
          <button className='link-style' onClick={handleDelete}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
      </div>
    );
  }
}
