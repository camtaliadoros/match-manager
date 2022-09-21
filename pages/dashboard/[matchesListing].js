import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserMatches,
  selectCurrentUserDetails,
  selectMatchesInvited,
  selectMatchesPendingPayment,
  selectMatchesPlaying,
  selectMatchesRequests,
  selectUserMatches,
} from '../../features/users/userSlice';
import MatchesListing from '../../components/match-listing/MatchesListing';
import Layout from '../../components/layout/Layout';
import { useEffect } from 'react';
import {
  getMatchesById,
  selectMatches,
} from '../../features/matches/matchesSlice';

export default function MatchesListingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUserDetails);
  const listingType = router.query.matchesListing;
  const allUserMatches = useSelector(selectUserMatches);
  const matchesData = useSelector(selectMatches);

  const upcomingMatches = useSelector(selectMatchesPlaying);
  const matchInvites = useSelector(selectMatchesInvited);
  const matchesPendingPayment = useSelector(selectMatchesPendingPayment);
  const matchRequests = useSelector(selectMatchesRequests);

  useEffect(() => {
    if (user.id) {
      if (!allUserMatches.length) {
        dispatch(getUserMatches(user.id));
      }
    }
  }, [user.id]);

  useEffect(() => {
    let matchesToFetch;

    if (listingType === 'upcoming-matches') {
      matchesToFetch = upcomingMatches;
    } else if (listingType === 'match-invites') {
      matchesToFetch = matchInvites;
    } else if (listingType === 'pending-payment') {
      matchesToFetch = matchesPendingPayment;
    } else if (listingType === 'match-requests') {
      matchesToFetch = matchRequests;
    }

    matchesToFetch.length && dispatch(getMatchesById(matchesToFetch));
  }, [
    upcomingMatches.length,
    matchInvites.length,
    matchesPendingPayment.length,
    matchRequests.length,
  ]);

  return (
    <Layout>
      <MatchesListing display='all' type={listingType} matches={matchesData} />
    </Layout>
  );
}
