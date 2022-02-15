import Link from 'next/link';
import MatchCard from './MatchCard';
import classes from './matchListing.module.scss';

export default function UpcomingMatchesListing({ display }) {
  return (
    <div className={classes.listingWrapper}>
      <Link href='./upcoming-matches'>
        <a className='title'>Upcoming Matches</a>
      </Link>
      <MatchCard />
    </div>
  );
}
