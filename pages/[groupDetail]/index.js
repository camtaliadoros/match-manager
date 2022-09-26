import {
  faPencil,
  faCirclePlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
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
  selectGroupPlayers,
  selectGroupPlayersByStatus,
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
  const groupPlayersByStatus = useSelector(selectGroupPlayersByStatus);
  const currentUser = useSelector(selectCurrentUserDetails);
  const groupMatches = useSelector(selectSortedMatches);

  const [groupName, setGroupName] = useState(currentGroup.name);
  const [isAdmin, setIsAdmin] = useState();
  const [isGroupParticipant, setIsGroupParticipant] = useState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setnewGroupName] = useState('');
  const [newPath, setNewPath] = useState();

  const groupParticipants = [
    ...groupPlayersByStatus.core,
    ...groupPlayersByStatus.reserve,
    ...groupPlayersByStatus.admin,
  ];

  useEffect(() => {
    setIsGroupParticipant(groupParticipants.includes(currentUser.id));
  }, [currentGroup.players.length]);

  useEffect(() => {
    if (currentPath && currentGroup.path !== currentPath) {
      dispatch(getCurrentGroup(currentPath));
    }
  }, [currentPath]);

  useEffect(() => {
    if (currentGroup.id) {
      dispatch(getGroupMatches(currentGroup.id));
    }
  }, [currentGroup.id]);

  useEffect(() => {
    if (currentGroup.id) {
      setGroupName(currentGroup.name);
      setIsAdmin(groupPlayersByStatus.admin.includes(currentUser.id));
    }
  }, [currentGroup]);

  const handleClick = () => {
    router.push(`/${currentPath}/create-match`);
  };

  const handleEditClick = () => {
    setIsEditingName(!isEditingName);
  };

  const handleSaveClick = () => {
    const groupId = currentGroup.id;
    setNewPath(newGroupName.toLowerCase().replace(' ', '-'));
    dispatch(updateGroupName({ newGroupName, newPath, groupId }));
    setIsEditingName(false);
    router.replace(newPath, undefined, { shallow: true });
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

  return (
    <Layout>
      <div className='details-wrapper'>
        <div className='flex-row'>
          {isEditingName ? (
            <form className='one-line'>
              <input
                type='text'
                value={newGroupName}
                onChange={(e) => setnewGroupName(e.target.value)}
                placeholder={groupName}
                required
              />
              <button onClick={handleSaveClick} disabled={!newGroupName}>
                SAVE
              </button>
            </form>
          ) : (
            <h2 className='title'>{groupName}</h2>
          )}

          {isAdmin ? (
            isEditingName ? (
              <button className='link-style' onClick={handleEditClick}>
                <FontAwesomeIcon icon={faXmark} className='icon' />
              </button>
            ) : (
              <button className='link-style' onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencil} className='icon' />
              </button>
            )
          ) : null}
        </div>
        {!isGroupParticipant && <RequestGroupAdmission />}
        <div className='matchcard-wrapper'>
          <MatchesListing
            type='upcoming-matches'
            display={1}
            matches={groupMatches}
          />

          {isAdmin && (
            <button className='link-style' onClick={handleClick}>
              <FontAwesomeIcon icon={faCirclePlus} />
              Create Match
            </button>
          )}
        </div>

        <GroupPlayerListing />
        <GroupShare />
      </div>
    </Layout>
  );
}
