import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentGroup,
  selectGroup,
  selectUserIsAdmin,
} from '../../features/group/groupSlice';
import {
  selectCurrentMatch,
  selectMatchPlayers,
} from '../../features/matches/matchSlice';
import { getPlayersData } from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import MatchPlayerActions from './MatchPlayerActions';

export default function MatchPlayerListing() {
  const players = useSelector(selectMatchPlayers);
  const currentUser = useSelector(selectCurrentUser);
  const userIsAdmin = useSelector(selectUserIsAdmin);

  const dispatch = useDispatch();

  const [playing, setPlaying] = useState();
  const [requested, setRequested] = useState();
  const [waitlist, setWaitlist] = useState();
  const [playersToFetch, setPlayersToFetch] = useState([]);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    if (players) {
      setPlaying(players.playing);
      setRequested(players.requested);
      setWaitlist(players.waitlist);

      const allPlayers = players.playing.concat(
        players.requested,
        players.waitlist
      );

      const playerIds = allPlayers.map((player) => player.playerId);

      setPlayersToFetch(
        playerIds.filter((player) => player !== currentUser.id)
      );
    }
  }, [players]);

  useEffect(() => {
    if (playersToFetch.length > 0) {
      dispatch(getPlayersData(playersToFetch));
    }
  }, [playersToFetch.length]);

  // useEffect(() => {
  //   setIsAdmin(userIsAdmin);
  // }, [userIsAdmin]);

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
        {userIsAdmin ? <p>User is admin</p> : <p>Not admin</p>}
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
        {requested && requested.length !== 0 ? (
          <h3 className='title'>Requested</h3>
        ) : null}
        {requested
          ? requested.map((player, i) => (
              <MatchPlayerActions key={i} player={player} />
            ))
          : null}
      </div>
    </>
  );
}
