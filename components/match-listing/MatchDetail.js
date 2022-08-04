import {
  faCalendar,
  faClock,
  faFutbol,
} from '@fortawesome/free-regular-svg-icons';
import {
  faEye,
  faLocationDot,
  faMoneyBill,
  faRepeat,
  faShirt,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  getCurrentGroup,
  selectGroup,
  setIsAdmin,
} from '../../features/group/groupSlice';
import {
  createMatch,
  inviteCorePlayers,
  selectCurrentMatch,
} from '../../features/matches/matchSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import classes from './match.module.scss';

export default function MatchDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const groupPath = router.query.groupDetail;

  const match = useSelector(selectCurrentMatch);
  const group = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [numOfPlayers, setNumOfPlayers] = useState('');
  const [cost, setCost] = useState('');
  const [costPerPlayer, setCostPerPlayer] = useState('');

  useEffect(() => {
    if (router.asPath === `/${groupPath}/create-match`) {
      setIsEditing(true);
    }
  }, [router]);

  useEffect(() => {
    if (!group.path && groupPath) {
      dispatch(getCurrentGroup(groupPath));
    }
  }, [groupPath]);

  useEffect(() => {
    if (match.id) {
      const matchDate = moment
        .unix(match.timestamp / 1000)
        .format('dddd, MMMM Do');
      const matchTime = moment.unix(match.timestamp / 1000).format('h:mm a');

      setDate(matchDate);
      setTime(matchTime);
      setTitle(match.title);
      setLocation(match.location);
      setIsPublic(match.isPublic);
      setIsRecurring(match.isRecurring);
      setNumOfPlayers(match.numOfPlayers);
      setCost(match.cost);
    }
  }, [match]);

  useEffect(() => {
    if (group.id && currentUser.id) {
      const groupAdmins = group.players.admin;
      dispatch(setIsAdmin(groupAdmins.includes(currentUser.id)));
    }
  }, [group.id, currentUser.id]);

  const handleClick = (e) => {
    e.preventDefault();

    const matchId = uuidv4();
    const timestamp = Date.parse(`${date} ${time}`);

    const matchData = {
      id: matchId,
      title,
      timestamp,
      groupId: group.id,
      location,
      isPublic,
      isRecurring,
      numOfPlayers,
      cost,
    };

    const playerData = {
      matchId,
      groupPlayers: group.players,
    };

    dispatch(createMatch(matchData));
    dispatch(inviteCorePlayers(playerData));

    if (router.asPath === `/${groupPath}/create-match`) {
      router.push(`/${groupPath}/${matchData.id}`);
    }
  };

  useEffect(() => {
    setCostPerPlayer(
      new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP',
      }).format(cost / numOfPlayers)
    );
  }, [cost, numOfPlayers]);

  return (
    <>
      <form onSubmit={handleClick}>
        {isEditing ? (
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Match Title'
            required
          />
        ) : (
          <h2>{title}</h2>
        )}
        <div className={classes.matchDataContainer}>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faCalendar} className='data-icon' />
            {isEditing ? (
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            ) : (
              <p>{date}</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faLocationDot} className='data-icon' />
            {isEditing ? (
              <input
                type='text'
                placeholder='Location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            ) : (
              <p>{location}</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faUserGroup} className='data-icon' />
            <Link href={groupPath ? `/${groupPath}` : '/'}>{group.name}</Link>
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faEye} className='data-icon' />
            {isEditing ? (
              <div>
                <input
                  type='checkbox'
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                <label>Is Looking for players</label>
              </div>
            ) : isPublic ? (
              <p>Looking for players</p>
            ) : (
              <p>Not looking for players</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faClock} className='data-icon' />
            {isEditing ? (
              <input
                type='time'
                placeholder='Time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            ) : (
              <p>{time}</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faRepeat} className='data-icon' />
            {isEditing ? (
              <div>
                <input
                  type='checkbox'
                  onChange={() => setIsRecurring(!isRecurring)}
                  checked={isRecurring}
                />
                <label>Recurring Match</label>
              </div>
            ) : isRecurring ? (
              <p>Recurring Game</p>
            ) : (
              <p>One-off game</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faShirt} className='data-icon' />
            {isEditing ? (
              <input
                type='number'
                placeholder='Number of Players'
                value={numOfPlayers}
                onChange={(e) => setNumOfPlayers(e.target.value)}
                required
              />
            ) : (
              <p>{numOfPlayers} players</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faFutbol} className='data-icon' />
            {isEditing ? (
              <input
                type='number'
                placeholder='Total cost of pitch'
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            ) : (
              <p>£ {cost}</p>
            )}
          </div>
          <div className={classes.matchDataRow}>
            <FontAwesomeIcon icon={faMoneyBill} className='data-icon' />
            {costPerPlayer ? <p>{costPerPlayer}</p> : null}
          </div>
        </div>
        {isEditing ? <button>SAVE</button> : null}
      </form>
    </>
  );
}
