import { useEffect, useState } from 'react';
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
import { getMatchesById, selectMatches } from './matchesSlice';

export default function MatchHome() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUserDetails);

  const upcomingMatches = useSelector(selectMatchesPlaying);
  const matchInvites = useSelector(selectMatchesInvited);
  const matchesPendingPayment = useSelector(selectMatchesPendingPayment);
  const matchRequests = useSelector(selectMatchesRequests);
  const matchesData = useSelector(selectMatches);

  const [upcomingMatchData, setUpcomingMatchData] = useState();
  const [matchInviteData, setMatchInviteData] = useState();
  const [pendingPaymentMatchData, setPendingPaymentMatchData] = useState();
  const [matchRequestData, setMatchRequestData] = useState();

  useEffect(() => {
    if (user.id) {
      dispatch(getUserMatches(user.id));
    }
  }, [user.id]);

  useEffect(() => {
    const matchesToFetch = [];

    upcomingMatches.length && matchesToFetch.push(upcomingMatches[0]);
    matchInvites.length && matchesToFetch.push(matchInvites[0]);
    matchesPendingPayment.length &&
      matchesToFetch.push(matchesPendingPayment[0]);
    matchRequests.length && matchesToFetch.push(matchRequests[0]);

    matchesToFetch.length && dispatch(getMatchesById(matchesToFetch));
  }, [
    upcomingMatches.length,
    matchInvites.length,
    matchesPendingPayment.length,
    matchRequests.length,
  ]);

  useEffect(() => {
    setUpcomingMatchData(
      matchesData.filter((match) => match.id === upcomingMatches[0])
    );
    setMatchInviteData(
      matchesData.filter((match) => match.id === matchInvites[0])
    );
    setPendingPaymentMatchData(
      matchesData.filter((match) => match.id === matchesPendingPayment[0])
    );
    setMatchRequestData(
      matchesData.filter((match) => match.id === matchRequests[0])
    );
  }, [matchesData]);

  return (
    <div className='details-wrapper'>
      <MatchesListing
        display={1}
        type='upcomingMatches'
        matches={upcomingMatchData}
      />
      <MatchesListing
        display={1}
        type='matchInvites'
        matches={matchInviteData}
      />
      <MatchesListing
        display={1}
        type='pendingPayment'
        matches={pendingPaymentMatchData}
      />
      <MatchesListing
        display={1}
        type='matchRequests'
        matches={matchRequestData}
      />
    </div>
  );
}
