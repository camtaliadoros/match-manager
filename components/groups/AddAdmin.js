import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeGroupPlayer,
  selectGroup,
  updatePlayerStatus,
} from '../../features/group/groupSlice';
import { selectPlayers } from '../../features/users/playersSlice';
import DialogBox from '../shared/DialogBox';

export default function AddAdmin({ needsNewAdmin, currentPlayer }) {
  const group = useSelector(selectGroup);
  const players = useSelector(selectPlayers);
  const dispatch = useDispatch();

  const [playersArr, setPlayersArr] = useState(group.players.core);
  const [newAdmin, setNewAdmin] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setPlayersArr(group.players.core);
  }, [group]);

  const handleClose = () => {
    needsNewAdmin(false);
  };

  const handleChange = (e) => {
    setNewAdmin(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAdmin) {
      setErrorMessage('Please select a player');
    } else {
      setErrorMessage('');
      const groupId = group.id;

      dispatch(
        updatePlayerStatus({
          playerId: newAdmin,
          groupId,
          playerStatus: 'admin',
        })
      );
      dispatch(removeGroupPlayer({ playerId: currentPlayer, groupId }));
      needsNewAdmin(false);
    }
  };

  return (
    <DialogBox close={handleClose}>
      <h3>You must nominate a new admin before exiting the group</h3>
      <form onSubmit={handleSubmit}>
        <select value={newAdmin} onChange={handleChange}>
          <option value=''>--</option>
          {playersArr.map((playerId, i) => (
            <option value={playerId}>{players[playerId].username}</option>
          ))}
        </select>
        <button>SAVE</button>
        {errorMessage}
      </form>
    </DialogBox>
  );
}
