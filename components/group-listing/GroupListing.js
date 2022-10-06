import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGroupsById,
  selectGroupsIsLoading,
} from '../../features/groups/groupsSlice';
import {
  getUserGroups,
  selectCurrentUserDetails,
  selectUserGroupsIds,
  selectUserGroupsManager,
  selectUserGroupsParticipant,
  selectUserIsLoading,
} from '../../features/users/userSlice';
import LoadingState from '../shared/LoadingState';
import GroupCard from './GroupCard';

export default function GroupListing() {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUserDetails);

  const groupsToFetch = useSelector(selectUserGroupsIds);
  const adminGroups = useSelector(selectUserGroupsManager);
  const participantGroups = useSelector(selectUserGroupsParticipant);
  const userIsLoading = useSelector(selectUserIsLoading);
  const groupsAreLoading = useSelector(selectGroupsIsLoading);

  useEffect(() => {
    if (currentUser.id) {
      dispatch(getUserGroups(currentUser.id));
    }
  }, [currentUser.id]);

  useEffect(() => {
    if (groupsToFetch?.length) {
      dispatch(getGroupsById(groupsToFetch));
    }
  }, [groupsToFetch.length]);

  if (userIsLoading || groupsAreLoading) {
    return <LoadingState />;
  } else {
    return (
      <div className='details-wrapper'>
        <h3 className='title'>My Groups</h3>
        {!participantGroups.length && <p>You're not a member of any groups</p>}
        {participantGroups.map((groupId, i) => (
          <GroupCard key={i} groupId={groupId} />
        ))}

        <h3 className='title'>Groups I Manage</h3>
        {!adminGroups.length && <p>You're not a manager of any groups</p>}
        {adminGroups.map((groupId, i) => (
          <GroupCard key={i} groupId={groupId} />
        ))}
      </div>
    );
  }
}
