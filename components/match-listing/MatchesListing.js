import Link from 'next/link';
import MatchCard from './MatchCard';
import classes from './matchListing.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function MatchesListing({ display, type }) {
  let title;
  switch (type) {
    case 'upcoming-matches':
      title = 'Upcoming Matches';
      break;
    case 'match-invites':
      title = 'Match Invites';
      break;
    case 'pending-payment':
      title = 'Matches Pending Payment';
      break;
    case 'match-requests':
      title = 'Match Requests';
      break;
    default:
      title = 'Matches';
  }

  return (
    <div className={classes.listingWrapper}>
      {/* <Link href=`./${type}`> */}
      <div className={classes.matchListingTitle}>
        <a className='title'>{title}</a>
        <FontAwesomeIcon icon={faAngleRight} className='next-icon' />
      </div>

      {/* </Link> */}
      <MatchCard />
    </div>
  );
}
