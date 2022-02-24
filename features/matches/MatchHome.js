import MatchesListing from '../../components/match-listing/MatchesListing';

export default function MatchHome() {
  return (
    <>
      <MatchesListing display={1} type='upcomingMatches' />
      <MatchesListing display={1} type='matchInvites' />
      <MatchesListing display={1} type='pendingPayment' />
      <MatchesListing display={1} type='matchRequests' />
    </>
  );
}
