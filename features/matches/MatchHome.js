import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatchesListing from '../../components/match-listing/MatchesListing';
import { selectCurrentUserDetails } from '../users/userSlice';

import {
  getUserMatches,
  selectMatchesInvited,
  selectMatchesPendingPayment,
  selectMatchesPlaying,
  selectMatchesRequests,
} from './../users/userSlice';

export default function MatchHome() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUserDetails);

  const upcomingMatches = useSelector(selectMatchesPlaying);
  const matchInvites = useSelector(selectMatchesInvited);
  const matchesPendingPayment = useSelector(selectMatchesPendingPayment);
  const matchRequests = useSelector(selectMatchesRequests);

  useEffect(() => {
    if (user.id) {
      dispatch(getUserMatches(user.id));
    }
  }, [user.id]);

  return (
    <>
      <MatchesListing
        display={1}
        type='upcomingMatches'
        matches={upcomingMatches}
      />
      <MatchesListing display={1} type='matchInvites' matches={matchInvites} />
      <MatchesListing
        display={1}
        type='pendingPayment'
        matches={matchesPendingPayment}
      />
      <MatchesListing
        display={1}
        type='matchRequests'
        matches={matchRequests}
      />
    </>
  );
}
