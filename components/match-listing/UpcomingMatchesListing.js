import Link from 'next/link';
import MatchCard from './MatchCard';
import classes from './matchListing.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function UpcomingMatchesListing({ display }) {
  return (
    <div className={classes.listingWrapper}>
      {/* <Link href='./upcoming-matches'> */}
      <a className='title'>Upcoming Matches</a>
      <FontAwesomeIcon icon={faAngleRight} className='icon' />
      {/* </Link> */}
      <MatchCard />
    </div>
  );
}
