import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentGroup, selectGroup } from '../../features/group/groupSlice';
import { createMatch } from '../../features/matches/matchSlice';

export default function MatchDetail() {
  const dispatch = useDispatch();
  const router = useRouter();

  const group = useSelector(selectGroup);

  const [isEditing, setIsEditing] = useState(true);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState('');
  const [numOfPlayers, setNumOfPlayers] = useState('');
  const [cost, setCost] = useState('');
  const [costPerPlayer, setCostPerPlayer] = useState('');

  useEffect(() => {
    if (!group.id) {
      const currentPath = router.query.groupDetail;
      dispatch(getCurrentGroup(currentPath));
    }
  });

  const handleClick = (e) => {
    e.preventDefault();
    const matchData = {
      title,
      date,
      group: group.id,
      location,
      isPublic,
      time,
      isRecurring,
      numOfPlayers,
      cost,
    };

    dispatch(createMatch(matchData));
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
      <form>
        {isEditing ? (
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Match Title'
          />
        ) : (
          <h2>{title}</h2>
        )}
        {isEditing ? (
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        ) : (
          <p>{date}</p>
        )}
        {isEditing ? (
          <input
            type='text'
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        ) : (
          <p>{location}</p>
        )}

        <p>{group.name}</p>

        {isEditing ? (
          <div>
            <input
              type='checkbox'
              onChange={() => setIsPublic(!isPublic)}
              checked={isPublic}
            />
            <label>Is Looking for players</label>
          </div>
        ) : isPublic ? (
          <p>Looking for players</p>
        ) : (
          <p>Not looking for players</p>
        )}
        {isEditing ? (
          <input
            type='time'
            placeholder='Time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        ) : (
          <p>{time}</p>
        )}
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
        {isEditing ? (
          <input
            type='number'
            placeholder='Number of Players'
            value={numOfPlayers}
            onChange={(e) => setNumOfPlayers(e.target.value)}
          />
        ) : (
          <p>{numOfPlayers} players</p>
        )}
        {isEditing ? (
          <input
            type='number'
            placeholder='Total cost of pitch'
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        ) : (
          <p>{cost}</p>
        )}
        {costPerPlayer ? <p>{costPerPlayer}</p> : null}
        <button onClick={handleClick}>SAVE</button>
      </form>
    </>
  );
}
