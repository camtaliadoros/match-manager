import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsAdmin } from '../../features/group/groupSlice';
import {
  selectMatchPlayers,
  selectMatchPlayersByStatus,
} from '../../features/matches/matchSlice';
import { getPlayersData } from '../../features/users/playersSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';
import MatchPlayerActions from './MatchPlayerActions';
import classes from './players.module.scss';

export default function MatchPlayerListing() {
  const players = useSelector(selectMatchPlayers);
  const currentUser = useSelector(selectCurrentUserDetails);
  const userIsAdmin = useSelector(selectUserIsAdmin);
  const matchPlayersByStatus = useSelector(selectMatchPlayersByStatus);

  const dispatch = useDispatch();

  const [playersToFetch, setPlayersToFetch] = useState([]);

  useEffect(() => {
    if (players) {
      const playerIdsToFetch = players
        .filter((player) => player.playerId !== currentUser.id)
        .map((player) => player.playerId);

      setPlayersToFetch(playerIdsToFetch);
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
          {matchPlayersByStatus.playing
            ? matchPlayersByStatus.playing.map((player, i) => (
                <MatchPlayerActions key={i} player={player} />
              ))
            : null}
        </div>
        <div>
          {matchPlayersByStatus.waitlist &&
          matchPlayersByStatus.waitlist.length !== 0 ? (
            <h3 className='title'>Waitlist</h3>
          ) : null}
          {matchPlayersByStatus.waitlist
            ? matchPlayersByStatus.waitlist.map((player, i) => (
                <MatchPlayerActions key={i} player={player} />
              ))
            : null}
        </div>
        <div>
          {userIsAdmin ? (
            <>
              {matchPlayersByStatus.requested?.length ? (
                <h3 className='title'>Requested</h3>
              ) : null}
              {matchPlayersByStatus.requested
                ? matchPlayersByStatus.requested.map((player, i) => (
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
