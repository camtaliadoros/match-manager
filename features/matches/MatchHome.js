import MatchesListing from '../../components/match-listing/MatchesListing';

export default function MatchHome() {
  return (
    <>
      <MatchesListing display={1} type='upcoming-matches' />
      <MatchesListing display={1} type='match-invites' />
      <MatchesListing display={1} type='pending-payment' />
      <MatchesListing display={1} type='match-requests' />
    </>
  );
}
