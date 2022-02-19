import { useSelector } from 'react-redux';
import { selectGroup } from '../../features/group/groupsSlice';
import MatchesListing from '../match-listing/MatchesListing';
import PlayerListing from '../Players/PlayerListing';

export default function GroupContainer() {
  const currentGroup = useSelector(selectGroup);
  const isAdmin = currentGroup.status === 'admin' ? true : false;
  const groupName = currentGroup.name;
  const players = currentGroup.players;

  return (
    <>
      <h2>{groupName}</h2>
      <MatchesListing type='upcoming-matches' display='1' />
      <PlayerListing type='group' players={players} />
    </>
  );
}
