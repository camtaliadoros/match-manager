import { useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import MatchesListing from '../../components/match-listing/MatchesListing';
import { selectMatches } from '../../features/matches/matchesSlice';

export default function upcomingMatches() {
  const matches = useSelector(selectMatches);

  return (
    <Layout>
      <div className='details-wrapper'>
        <MatchesListing
          display='all'
          type='upcoming-matches'
          matches={matches}
        />
      </div>
    </Layout>
  );
}
