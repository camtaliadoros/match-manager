import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import MatchesListing from '../../components/match-listing/MatchesListing';
import NotFound from '../../components/shared/NotFound';
import {
  getCurrentGroup,
  groupIsLoading,
  selectGroup,
} from '../../features/group/groupSlice';
import { selectCurrentUser } from '../../features/usersSlice';

export default function GroupDetail() {
  const dispatch = useDispatch();

  const router = useRouter();
  let currentPath = router.query.groupDetail;

  const isLoading = useSelector(groupIsLoading);
  const currentGroup = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentPath && currentGroup.path !== currentPath) {
      dispatch(getCurrentGroup(currentPath));
      // dispatch(getGroupPlayers(currentPath));
    }
  }, [router]);

  // get group matches

  const adminArr = currentGroup.players.admin;
  const isAdmin = adminArr.includes(currentUser.uid);

  const groupName = currentGroup.name;
  const players = currentGroup.players;
  const matches = currentGroup.matches;

  if (isLoading) {
    return (
      <Layout>
        <h1>Loading</h1>
      </Layout>
    );
  }

  if (!groupName) {
    return (
      <Layout>
        <NotFound type='group' />
      </Layout>
    );
  }
  return (
    <Layout>
      <h2>{groupName}</h2>

      {matches.length === 0 ? (
        <p>No upcoming Matches</p>
      ) : (
        <MatchesListing type='upcomingMatches' display='1' matches={matches} />
      )}
      {isAdmin && <button>Create Match</button>}

      {/* <PlayerListing type='group' players={players} /> */}
    </Layout>
  );
}
