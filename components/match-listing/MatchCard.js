import { selectMatches } from '../../features/matches/matchesSlice';
import { useDispatch, useSelector } from 'react-redux';
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
import { selectGroup } from '../../features/group/groupSlice';
import Link from 'next/link';
import { getCurrentMatch } from '../../features/matches/matchSlice';

export default function MatchCard({ matchId }) {
  const matches = useSelector(selectMatches);
  const currentGroup = useSelector(selectGroup);
  const onWaitlist = true;

  const dispatch = useDispatch();

  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchGroup, setMatchGroup] = useState('');
  const [matchLocation, setMatchLocation] = useState(matchData.location);
  const [groupPath, setGroupPath] = useState();

  useEffect(() => {
    if (matchId) {
      dispatch(getCurrentMatch(matchId));
    }
  }, [matchId]);

  const getGroupName = async (groupId) => {
    if (groupId === currentGroup.id) {
      setMatchGroup(currentGroup.name);
      setGroupPath(currentGroup.path);
    } else {
      const q = query(collection(db, 'groups'), where('id', '==', groupId));
      let groupData = {};

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        groupData = doc.data();
      });
      setMatchGroup(groupData.name);
      setGroupPath(groupData.path);
    }
  };

  useEffect(() => {
    const date = moment
      .unix(matchData.timestamp / 1000)
      .format('dddd, MMMM Do');
    const time = moment.unix(matchData.timestamp / 1000).format('h:mm a');
    getGroupName(matchData.groupId);

    setMatchDate(date);
    setMatchTime(time);
    setMatchLocation(matchData.location);
  }, [matches]);

  return (
    <Link href={`./${groupPath}/${matchId}`}>
      <div className='card'>
        {onWaitlist ? (
          <p className={classes.waitlistText}>On Waitlist</p>
        ) : null}
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
    </Link>
  );
}
