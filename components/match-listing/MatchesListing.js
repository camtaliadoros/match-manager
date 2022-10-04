import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './match.module.scss';
import MatchCard from './MatchCard';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MatchesListing({ display, type, matches }) {
  const typeMap = {
    'upcoming-matches': {
      title: 'Upcoming Matches',
      link: 'upcoming-matches',
    },
    'match-invites': {
      title: 'Match Invites',
      link: 'match-invites',
    },
    'pending-payment': {
      title: 'Pending Payment',
      link: 'pending-payment',
    },
    'match-requests': {
      title: 'Match Requests',
      link: 'match-requests',
    },
  };

  const router = useRouter();

  const title = typeMap[type]?.title;
  const currentPath = router.asPath;
  const path = typeMap[type]?.link;

  return (
    <div className='listing-wrapper'>
      <Link href={`${currentPath}/${path}`}>
        <div className={classes.matchListingTitle}>
          <h3 className='title'>{title}</h3>
          {display === 1 ? (
            <FontAwesomeIcon icon={faAngleRight} className='next-icon' />
          ) : null}
        </div>
      </Link>
      {matches?.length ? (
        display === 1 ? (
          <MatchCard matchData={matches[0]} />
        ) : (
          matches.map((match, i) => <MatchCard matchData={match} key={i} />)
        )
      ) : (
        <p>No upcoming Matches</p>
      )}
    </div>
  );
}
