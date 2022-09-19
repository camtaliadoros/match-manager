import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectMatchesPlaying } from '../../features/users/userSlice';
import MatchesListing from '../../components/match-listing/MatchesListing';
import Layout from '../../components/layout/Layout';

export default function MatchesListingPage() {
  const router = useRouter();
  const listingType = router.query.matchesListing;
  const upcomingMatches = useSelector(selectMatchesPlaying);

  return (
    <Layout>
      <MatchesListing
        display='all'
        type={listingType}
        matches={upcomingMatches}
      />
    </Layout>
  );
}
