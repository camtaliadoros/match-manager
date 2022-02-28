import { useSelector } from 'react-redux';
import { selectGroup, selectIsLoading } from '../../features/group/groupsSlice';
import { selectCurrentUser } from '../../features/usersSlice';
import MatchesListing from '../match-listing/MatchesListing';
import PlayerListing from '../Players/PlayerListing';

export default function GroupContainer() {
  const isLoading = useSelector(selectIsLoading);
  const currentGroup = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);
  const adminArr = currentGroup.players.admin;
  const isAdmin = adminArr.includes(currentUser.uid);

  const groupName = currentGroup.name;
  const players = currentGroup.players;
  const matches = currentGroup.matches;

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <>
      <h2>{groupName}</h2>

      {isAdmin && matches.length === 0 ? (
        <p>Create Match</p>
      ) : (
        <MatchesListing type='upcomingMatches' display='1' matches={matches} />
      )}
      {/* <PlayerListing type='group' players={players} /> */}
    </>
  );
}
