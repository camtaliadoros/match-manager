import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  selectGroupsByPath,
  selectIsLoading,
} from '../../features/group/groupsSlice';
import { selectCurrentUser } from '../../features/usersSlice';
import MatchesListing from '../match-listing/MatchesListing';
import PlayerListing from '../Players/PlayerListing';

export default function GroupContainer() {
  const router = useRouter();
  const currentPath = router.query.groupDetail;
  const isLoading = useSelector(selectIsLoading);
  const groupsByPath = useSelector(selectGroupsByPath);
  const currentGroup = groupsByPath[currentPath];
  console.log(currentGroup);
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

      {matches.length === 0 ? (
        <p>No upcoming Matches</p>
      ) : (
        <MatchesListing type='upcomingMatches' display='1' matches={matches} />
      )}
      {isAdmin && <button>Create Match</button>}

      {/* <PlayerListing type='group' players={players} /> */}
    </>
  );
}
