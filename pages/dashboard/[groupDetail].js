import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCurrentGroup,
  getGroupPlayers,
  groupIsLoading,
  selectGroup,
} from '../../features/group/groupSlice';

import { selectCurrentUser } from '../../features/usersSlice';
import MatchesListing from '../../components/match-listing/MatchesListing';
import PlayerListing from '../../components/Players/PlayerListing';
import { useEffect } from 'react';
import { db } from '../../firebase/clientApp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

export default function GroupDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  let currentPath = router.query.groupDetail;

  useEffect(() => {
    if (currentPath) {
      dispatch(getCurrentGroup(currentPath));
      dispatch(getGroupPlayers(currentPath));
    }
  }, [router]);

  // get group matches

  const isLoading = useSelector(groupIsLoading);
  const currentGroup = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);

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
