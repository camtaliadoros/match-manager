import { selectMatches } from '../../features/matches/matchesSlice';
import { useSelector } from 'react-redux';
import classes from './match.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faClock,
  faUserGroup,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

export default function MatchCard() {
  const matchData = useSelector(selectMatches);
  const currentMatch = matchData.match1;
  const matchDate = currentMatch.date;
  const matchTime = currentMatch.time;
  const matchGroupID = currentMatch.group; // ToDo: retrieve group data
  const matchLocation = currentMatch.location;
  const onWaitlist = true;

  return (
    <div className='card'>
      {onWaitlist ? <p className={classes.waitlistText}>On Waitlist</p> : null}
      <div className={classes.matchDataWrapper}>
        <div className={classes.matchData}>
          <div className={classes.iconContainer}>
            <FontAwesomeIcon icon={faCalendar} className='icon' />
          </div>
          <p>{matchDate}</p>
        </div>
        <div className={classes.matchData}>
          <div className={classes.iconContainer}>
            <FontAwesomeIcon icon={faClock} className='icon' />
          </div>
          <p>{matchTime}</p>
        </div>
        <div className={classes.matchData}>
          <div className={classes.iconContainer}>
            <FontAwesomeIcon icon={faUserGroup} className='icon' />
          </div>
          <p>{matchGroupID}</p>
        </div>
        <div className={classes.matchData}>
          <div className={classes.iconContainer}>
            <FontAwesomeIcon icon={faLocationDot} className='icon' />
          </div>
          <p>{matchLocation}</p>
        </div>
      </div>
    </div>
  );
}
