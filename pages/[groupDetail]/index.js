import { faPencil, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupShare from '../../components/groups/GroupShare';
import RequestGroupAdmission from '../../components/groups/RequestGroupAdmission';
import Layout from '../../components/layout/Layout';
import MatchesListing from '../../components/match-listing/MatchesListing';
import GroupPlayerListing from '../../components/Players/GroupPlayerListing';
import LoadingState from '../../components/shared/LoadingState';
import NotFound from '../../components/shared/NotFound';
import {
  getCurrentGroup,
  groupIsLoading,
  selectGroup,
  updateGroupName,
} from '../../features/group/groupSlice';
import {
  selectMatches,
  getGroupMatches,
  selectSortedMatches,
} from '../../features/matches/matchesSlice';
import { selectCurrentUserDetails } from '../../features/users/userSlice';

export default function GroupDetail() {
  const dispatch = useDispatch();

  const router = useRouter();
  let currentPath = router.query.groupDetail;

  const isLoading = useSelector(groupIsLoading);
  const currentGroup = useSelector(selectGroup);
  const currentUser = useSelector(selectCurrentUserDetails);
  const groupMatches = useSelector(selectSortedMatches);

  const [groupName, setGroupName] = useState(currentGroup.name);
  const [players, setPlayers] = useState(currentGroup.players);
  const [matches, setMatches] = useState([]);
  const [isAdmin, setIsAdmin] = useState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setnewGroupName] = useState('');

  useEffect(() => {
    if (currentPath && currentGroup.path !== currentPath) {
      dispatch(getCurrentGroup(currentPath));
    }
  }, [currentPath]);

  useEffect(() => {
    if (currentGroup.id) {
      dispatch(getGroupMatches(currentGroup.id));
      setMatches(groupMatches);
    }
  }, [currentGroup.id]);

  // useEffect(() => {
  //   if (groupMatches) {
  //     setMatches(groupMatches);
  //   }
  // }, [groupMatches]);

  useEffect(() => {
    if (currentGroup.id) {
      setGroupName(currentGroup.name);
      const adminArr = currentGroup.players.admin;
      setIsAdmin(adminArr.includes(currentUser.id));
      setPlayers(currentGroup.players);
    }
  }, [currentGroup]);

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

  if (!currentGroup.id) {
    return (
      <Layout>
        <NotFound type='group' />
      </Layout>
    );
  }

  const handleEditClick = () => {
    setIsEditingName(!isEditingName);
  };

  const handleSaveClick = () => {
    const groupId = currentGroup.id;
    const newPath = newGroupName.toLowerCase().replace(' ', '-');
    dispatch(updateGroupName({ newGroupName, newPath, groupId }));
    setIsEditingName(false);
    router.replace(newPath, undefined, { shallow: true });
  };

  return (
    <Layout>
      <div className='details-wrapper'>
        <div className='flex-row'>
          {isEditingName ? (
            <input
              type='text'
              value={newGroupName}
              onChange={(e) => setnewGroupName(e.target.value)}
              placeholder={groupName}
              required
            />
          ) : (
            <h2 className='title'>{groupName}</h2>
          )}

          {isAdmin ? (
            isEditingName ? (
              <button onClick={handleSaveClick}>SAVE</button>
            ) : (
              <button className='link-style' onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencil} className='icon' />
              </button>
            )
          ) : null}
        </div>
        <RequestGroupAdmission players={players} />
        <div className='matchcard-wrapper'>
          <MatchesListing
            type='upcomingMatches'
            display='1'
            matches={groupMatches}
          />

          {isAdmin && (
            <button className='link-style' onClick={handleClick}>
              <FontAwesomeIcon icon={faCirclePlus} />
              Create Match
            </button>
          )}
        </div>

        <GroupPlayerListing players={players} />
        <GroupShare />
      </div>
    </Layout>
  );
}
