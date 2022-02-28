import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGroupsByPath,
  selectIsLoading,
  getCurrentGroup,
  getGroupPlayers,
} from '../../features/group/groupsSlice';
import { selectCurrentUser } from '../../features/usersSlice';
import MatchesListing from '../../components/match-listing/MatchesListing';
import PlayerListing from '../../components/Players/PlayerListing';
import { useEffect } from 'react';

export default function GroupDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPath = router.query.groupDetail;

  dispatch(getCurrentGroup(currentPath));
  dispatch(getGroupPlayers(currentPath));

  // get current group
  // get group matches
  // get group players

  // const isLoading = useSelector(selectIsLoading);
  // const groupsByPath = useSelector(selectGroupsByPath);
  // let currentGroup = groupsByPath[currentPath];

  // const currentUser = useSelector(selectCurrentUser);
  // const adminArr = currentGroup.players.admin;
  // const isAdmin = adminArr.includes(currentUser.uid);

  // const groupName = currentGroup.name;
  // const players = currentGroup.players;
  // const matches = currentGroup.matches;

  // if (isLoading) {
  //   return (
  //     <Layout>
  //       <h1>Loading</h1>
  //     </Layout>
  //   );
  // }
  return <p>h3ey</p>;
  // <Layout>
  //   <h2>{groupName}</h2>

  //   {matches.length === 0 ? (
  //     <p>No upcoming Matches</p>
  //   ) : (
  //     <MatchesListing type='upcomingMatches' display='1' matches={matches} />
  //   )}
  //   {isAdmin && <button>Create Match</button>}

  //   {/* <PlayerListing type='group' players={players} /> */}
  // </Layout>
  // );
}
