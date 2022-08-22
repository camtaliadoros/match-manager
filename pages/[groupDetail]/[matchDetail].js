import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout/Layout';
import MatchDetail from '../../components/match-listing/MatchDetail';
import MatchPlayerListing from '../../components/Players/MatchPlayerListing';
import LoadingState from '../../components/shared/LoadingState';
import {
  getCurrentMatch,
  getMatchPlayers,
  selectCurrentMatch,
  selectMatchIsLoading,
} from '../../features/matches/matchSlice';

export default function MatchDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const matchId = router.query.matchDetail;
  const isLoading = useSelector(selectMatchIsLoading);
  const currentMatch = useSelector(selectCurrentMatch);

  useEffect(() => {
    if (matchId) {
      dispatch(getCurrentMatch(matchId));
      dispatch(getMatchPlayers(matchId));
    }
  }, [router]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (!currentMatch.id) {
    return <p>Match not found</p>;
  } else {
    return (
      <Layout>
        <div className='details-wrapper'>
          <MatchDetail />
          <MatchPlayerListing />
        </div>
      </Layout>
    );
  }
}
