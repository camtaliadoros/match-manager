import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './match.module.scss';
import MatchCard from './MatchCard';

export default function MatchesListing({ display, type, matches }) {
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
  const matchesIdArr = Object.keys(matches);

  return (
    <div className={classes.listingWrapper}>
      {/* <Link href=`./${path}`> */}
      <div className={classes.matchListingTitle}>
        <a className='title'>{title}</a>
        {display === '1' ? (
          <FontAwesomeIcon icon={faAngleRight} className='next-icon' />
        ) : null}
      </div>

      {/* </Link> */}
      {matchesIdArr.length > 0 ? (
        display === '1' ? (
          <MatchCard matchId={matchesIdArr[0]} />
        ) : (
          matchesIdArr.map((matchId, i) => (
            <MatchCard matchId={matchId} key={i} />
          ))
        )
      ) : (
        <p>No upcoming Matches</p>
      )}
    </div>
  );
}
