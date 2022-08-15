import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMatchPlayers } from '../../features/matches/matchSlice';
import { selectCurrentUser, setUser } from '../../features/users/userSlice';

export default function MatchPlayerStatus() {
  const currentUser = useSelector(selectCurrentUser);
  const matchPlayers = useSelector(selectMatchPlayers);

  const [userStatus, setUserStatus] = useState();

  useEffect(() => {
    if (matchPlayers) {
      const playing = matchPlayers.playing.find(
        (player) => player.playerId === currentUser.id
      );
      const notPlaying = matchPlayers.notPlaying.find(
        (player) => player.playerId === currentUser.id
      );
      const waitlist = matchPlayers.waitlist.find(
        (player) => player.playerId === currentUser.id
      );
      const requested = matchPlayers.requested.find(
        (player) => player.playerId === currentUser.id
      );
      const invited = matchPlayers.invited.find(
        (player) => player.playerId === currentUser.id
      );
      if (playing) {
        setUserStatus('playing');
      } else if (notPlaying) {
        setUserStatus('notPlaying');
      } else if (waitlist) {
        setUserStatus('waitlist');
      } else if (requested) {
        setUserStatus('requested');
      } else if (invited) {
        setUserStatus('invited');
      }
    }
  }, [matchPlayers]);

  if (userStatus === 'invited') {
    return (
      <>
        <button>IN</button>
        <button>OUT</button>
      </>
    );
  } else {
    return (
      <>
        {userStatus === 'playing' && <p>You're in!</p>}
        {userStatus === 'notPlaying' && <p>You're out!</p>}
        {userStatus === 'waitlist' && <p>On waitlist</p>}
        {userStatus === 'requested' && <p>Pending request</p>}
        <button>edit</button>
      </>
    );
  }
}
