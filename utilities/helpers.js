import { db } from '../firebase/clientApp';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';

export const getImageExtension = (imagePath) => {
  const startIndex = imagePath.indexOf('/');
  const endIndex = imagePath.indexOf(';');
  const imgType = imagePath.slice(startIndex + 1, endIndex);
  return imgType;
};

export const matchBatchDelete = async (matchId) => {
  const batch = writeBatch(db);

  // delete match
  batch.delete(doc(db, 'matches', matchId));

  // find match players
  const qPlayers = query(
    collection(db, 'user_matches'),
    where('matchId', '==', matchId)
  );
  const queryPlayersSnapshot = await getDocs(qPlayers);
  queryPlayersSnapshot.forEach((result) => {
    const player = result.data();
    const playerId = player.playerId;
    const docRef = playerId + '_' + matchId;
    batch.delete(doc(db, 'user_matches', docRef));
  });

  await batch.commit();
};
