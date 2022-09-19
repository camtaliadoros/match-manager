import { useRouter } from 'next/router';

export default function MatchesListing() {
  const router = useRouter();
  const listingType = router.query.MatchesListing;

  return <MatchesListing display='all' type={listingType} />;
}
