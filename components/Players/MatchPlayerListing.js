import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsAdmin } from '../../features/group/groupSlice';
import {
  selectMatchPlayers,
  selectMatchPlayersByStatus,
} from '../../features/matches/matchSlice';
import { getPlayersData } from '../../features/users/playersSlice';
import { selectCurrentUser } from '../../features/users/userSlice';
import MatchPlayerActions from './MatchPlayerActions';
import classes from './players.module.scss';

export default function MatchPlayerListing() {
  const players = useSelector(selectMatchPlayers);
  const playersByStatus = useSelector(selectMatchPlayersByStatus);
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
      // setPlaying(players.playing);
      // setRequested(players.requested ? players.requested : []);
      // setWaitlist(players.waitlist ? players.waitlist : []);

      // const allPlayers = players.playing.concat(
      //   players.requested,
      //   players.waitlist
      // );

      const playerIds = allPlayers.map((player) => {
        return player.playerId;
      });

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

  return (
    <>
      <div className={classes.playerListingWrapper}>
        <div>
          <h3 className='title'>Players</h3>
          {playersByStatus.playing
            ? playersByStatus.playing.map((player, i) => (
                <MatchPlayerActions key={i} player={player} />
              ))
            : null}
        </div>
        <div>
          {playersByStatus.waitlist && playersByStatus.waitlist.length !== 0 ? (
            <h3 className='title'>Waitlist</h3>
          ) : null}
          {playersByStatus.waitlist
            ? playersByStatus.waitlist.map((player, i) => (
                <MatchPlayerActions key={i} player={player} />
              ))
            : null}
        </div>
        <div>
          {userIsAdmin ? (
            <>
              {playersByStatus.requested &&
              playersByStatus.requested.length !== 0 ? (
                <h3 className='title'>Requested</h3>
              ) : null}
              {playersByStatus.requested
                ? playersByStatus.requested.map((player, i) => (
                    <MatchPlayerActions key={i} player={player} />
                  ))
                : null}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
