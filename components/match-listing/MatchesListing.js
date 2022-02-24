import Link from 'next/link';
import MatchCard from './MatchCard';
import classes from './matchListing.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function MatchesListing({ display, type }) {
  const typeMap = {
    upcomingMatches: {
      title: 'Upcoming Matches',
      link: '/upcoming-matches',
    },
    matchInvites: {
      title: 'Match Invites',
      link: '/match-invites',
    },
    pendingPayment: {
      title: 'Pending Payment',
      link: '/pending-payment',
    },
    matchRequests: {
      title: 'Match Requests',
      link: 'match-requests',
    },
  };

  const title = typeMap[type].title;
  const path = typeMap[type].link;

  return (
    <div className={classes.listingWrapper}>
      {/* <Link href=`./${path}`> */}
      <div className={classes.matchListingTitle}>
        <a className='title'>{title}</a>
        <FontAwesomeIcon icon={faAngleRight} className='next-icon' />
      </div>

      {/* </Link> */}
      <MatchCard />
    </div>
  );
}
