import { selectMatches } from '../../features/matches/matchesSlice';
import { useSelector } from 'react-redux';
import classes from './matchListing.module.scss';

export default function MatchCard() {
  const matchData = useSelector(selectMatches);
  const currentMatch = matchData.match1;
  const matchDate = currentMatch.date;
  const matchTime = currentMatch.time;
  const matchGroupID = currentMatch.group; // ToDo: retrieve group data
  const matchLocation = currentMatch.location;
  const onWaitlist = true;

  return (
    <div className='card'>
      {onWaitlist ? <p className={classes.waitlistText}>On Waitlist</p> : null}
      <div className={classes.matchData}>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='17.024'
            height='18.694'
            viewBox='0 0 17.024 18.694'
          >
            <g
              id='Icon_feather-calendar'
              data-name='Icon feather-calendar'
              transform='translate(1 1)'
            >
              <path
                id='Path_1'
                data-name='Path 1'
                d='M6.169,6H17.855a1.669,1.669,0,0,1,1.669,1.669V19.355a1.669,1.669,0,0,1-1.669,1.669H6.169A1.669,1.669,0,0,1,4.5,19.355V7.669A1.669,1.669,0,0,1,6.169,6Z'
                transform='translate(-4.5 -4.331)'
                fill='none'
                stroke='#adbca9'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
              <path
                id='Path_2'
                data-name='Path 2'
                d='M24,3V6.339'
                transform='translate(-13.149 -3)'
                fill='none'
                stroke='#adbca9'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
              <path
                id='Path_3'
                data-name='Path 3'
                d='M12,3V6.339'
                transform='translate(-7.827 -3)'
                fill='none'
                stroke='#adbca9'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
              <path
                id='Path_4'
                data-name='Path 4'
                d='M4.5,15H19.524'
                transform='translate(-4.5 -8.322)'
                fill='none'
                stroke='#adbca9'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
              />
            </g>
          </svg>

          {matchDate}
        </div>
        <div>{matchTime}</div>
        <div>{matchGroupID}</div>
        <div>{matchLocation}</div>
      </div>
    </div>
  );
}
