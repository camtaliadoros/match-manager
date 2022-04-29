import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentGroup, selectGroup } from '../../features/group/groupSlice';
import {
  selectCurrentMatch,
  selectMatchPlayers,
} from '../../features/matches/matchSlice';
import MatchPlayerActions from './MatchPlayerActions';

export default function MatchPlayerListing() {
  const players = useSelector(selectMatchPlayers);
  const matchDetails = useSelector(selectCurrentMatch);
  const currentGroup = useSelector(selectGroup);

  const dispatch = useDispatch();

  const [playing, setPlaying] = useState();
  const [requested, setRequested] = useState();
  const [waitlist, setWaitlist] = useState();
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    if (players) {
      setPlaying(players.playing);
      setRequested(players.requested);
      setWaitlist(players.waitlist);
    }
  }, [players]);

  // useEffect(() => {
  //   if (matchDetails.group) {
  //     if (matchDetails.group !== currentGroup.path) {
  //       dispatch(getCurrentGroup(matchDetails.group));
  //     }
  //   }
  // }, [matchDetails]);

  return (
    <>
      <div>
        <h3 className='title'>Players</h3>
        {playing
          ? playing.map((player, i) => (
              <MatchPlayerActions key={i} player={player} />
            ))
          : null}
      </div>
      <div>
        {waitlist && waitlist.length !== 0 ? (
          <h3 className='title'>Waitlist</h3>
        ) : null}
        {waitlist
          ? waitlist.map((player, i) => (
              <MatchPlayerActions key={i} player={player} />
            ))
          : null}
      </div>
      <div>
        {waitlist && waitlist.length !== 0 ? (
          <h3 className='title'>Waitlist</h3>
        ) : null}
        {waitlist
          ? waitlist.map((player, i) => (
              <MatchPlayerActions key={i} player={player} />
            ))
          : null}
      </div>
    </>
  );
}
