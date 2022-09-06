import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatchesListing from '../../components/match-listing/MatchesListing';
import { selectCurrentUserDetails } from '../users/userSlice';
import { getUserMatches } from './matchesSlice';

export default function MatchHome() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUserDetails);

  useEffect(() => {
    if (user) {
      dispatch(getUserMatches(user.id));
    }
  }, [user]);

  return (
    <>
      <MatchesListing display={1} type='upcomingMatches' />
      <MatchesListing display={1} type='matchInvites' />
      <MatchesListing display={1} type='pendingPayment' />
      <MatchesListing display={1} type='matchRequests' />
    </>
  );
}
