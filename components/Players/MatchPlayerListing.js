import { faChampagneGlasses } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMatchPlayers,
  selectMatchPlayers,
} from '../../features/matches/matchSlice';
import MatchPlayerActions from './MatchPlayerActions';

export default function MatchPlayerListing() {
  const players = useSelector(selectMatchPlayers);

  return (
    <>
      <MatchPlayerActions />
    </>
  );
}
