import {
  faCalendar,
  faClock,
  faLocationDot,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupSlice';
import { selectMatches } from '../../features/matches/matchesSlice';
import { db } from '../../firebase/clientApp';
import classes from './match.module.scss';

export default function MatchCard({ matchData }) {
  const matches = useSelector(selectMatches);
  const currentGroup = useSelector(selectGroup);
  const onWaitlist = true;

  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchGroup, setMatchGroup] = useState('');
  const [matchLocation, setMatchLocation] = useState(matchData.location);
  const [groupPath, setGroupPath] = useState();

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
    <Link href={`./${groupPath}/${matchData.id}`}>
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
