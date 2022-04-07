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
import { useEffect, useState } from 'react';
import moment from 'moment';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

export default function MatchCard({ matchId }) {
  const matchData = useSelector(selectMatches);
  const onWaitlist = true;

  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchGroup, setMatchGroup] = useState('');
  const [matchLocation, setMatchLocation] = useState('');

  const getGroupName = async (groupId) => {
    const q = query(collection(db, 'groups'), where('id', '==', groupId));
    let groupData = {};

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      groupData = doc.data();
    });
    return groupData;
  };

  useEffect(() => {
    const currentMatch = matchData[matchId];
    const date = moment.unix(currentMatch.date / 1000).format('dddd, MMMM Do');
    const time = moment.unix(currentMatch.date / 1000).format('h:mm a');
    const groupData = getGroupName(currentMatch.group).then((value) =>
      setMatchGroup(value.name)
    );

    setMatchDate(date);
    setMatchTime(time);
    setMatchLocation(currentMatch.location);
  }, [matchData]);

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
          <p>{matchGroup}</p>
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
