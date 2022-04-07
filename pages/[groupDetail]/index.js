import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupShare from '../../components/groups/GroupShare';
import RequestGroupAdmission from '../../components/groups/RequestGroupAdmission';
import Layout from '../../components/layout/Layout';
import MatchesListing from '../../components/match-listing/MatchesListing';
import PlayerListing from '../../components/Players/PlayerListing';
import LoadingState from '../../components/shared/LoadingState';
import NotFound from '../../components/shared/NotFound';
import {
  getCurrentGroup,
  groupIsLoading,
  selectGroup,
} from '../../features/group/groupSlice';
import {
  getGroupMatches,
  selectMatches,
} from '../../features/matches/matchesSlice';
import { selectCurrentUser } from '../../features/users/userSlice';

export default function GroupDetail() {
  const dispatch = useDispatch();

  const router = useRouter();
  let currentPath = router.query.groupDetail;

  const isLoading = useSelector(groupIsLoading);
  const currentGroup = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUser);
  const groupMatches = useSelector(selectMatches);

  const [groupName, setGroupName] = useState(currentGroup.name);
  const [players, setPlayers] = useState(currentGroup.players);
  const [matches, setMatches] = useState(currentGroup.matches);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    if (currentPath && currentGroup.path !== currentPath) {
      dispatch(getCurrentGroup(currentPath));
    }
  }, [router]);

  useEffect(() => {
    setGroupName(currentGroup.name);
    const adminArr = currentGroup.players.admin;
    setIsAdmin(adminArr.includes(currentUser.id));
    setPlayers(currentGroup.players);
    dispatch(getGroupMatches(currentGroup.id));
  }, [currentGroup]);

  useEffect(() => {
    setMatches(groupMatches);
  }, [groupMatches]);

  const handleClick = () => {
    router.push(`/${currentPath}/create-match`);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (!currentGroup.path) {
    return (
      <Layout>
        <NotFound type='group' />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className='details-wrapper'>
        <h2 className='title'>{groupName}</h2>
        <RequestGroupAdmission players={players} />

        <MatchesListing type='upcomingMatches' display='1' matches={matches} />

        {isAdmin && <button onClick={handleClick}>Create Match</button>}

        <PlayerListing players={players} />
        <GroupShare />
      </div>
    </Layout>
  );
}
