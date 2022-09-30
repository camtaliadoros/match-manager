import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/clientApp';

const initialState = {
  data: {
    players: [],
  },
  isLoading: false,
  failedToLoad: false,
};

export const getMatchDetails = (payload) => {
  return (dispatch) => {
    dispatch(getCurrentMatch(payload));
    dispatch(getMatchPlayers(payload));
  };
};

export const createMatch = (payload) => {
  return (dispatch) => {
    dispatch(setMatchDetails(payload.matchData));
    dispatch(inviteCorePlayers(payload.playersData));
  };
};

export const setMatchDetails = createAsyncThunk(
  'match/setMatchDetails',
  async (matchData) => {
    await setDoc(doc(db, 'matches', matchData.id), {
      id: matchData.id,
      title: matchData.title,
      timestamp: matchData.timestamp,
      groupId: matchData.groupId,
      isPublic: matchData.isPublic,
      isRecurring: matchData.isRecurring,
      location: matchData.location,
      numOfPlayers: matchData.numOfPlayers,
      cost: matchData.cost,
    });

    return matchData;
  }
);

export const inviteCorePlayers = createAsyncThunk(
  'match/inviteCorePlayers',
  async (playerData) => {
    const matchId = playerData.matchId;

    const adminPlayers = playerData.groupPlayers.filter(
      (player) => player.playerStatus === 'admin'
    );
    const corePlayers = playerData.groupPlayers.filter(
      (player) => player.playerStatus === 'core'
    );

    adminPlayers.forEach(async (player) => {
      await setDoc(doc(db, 'user_matches', `${player.playerId}_${matchId}`), {
        playerId: player.playerId,
        matchId,
        playerStatus: 'playing',
        paymentStatus: false,
      });
    });

    corePlayers.forEach(async (player) => {
      await setDoc(doc(db, 'user_matches', `${player.playerId}_${matchId}`), {
        playerId: player.playerId,
        matchId: matchId,
        playerStatus: 'invited',
        paymentStatus: false,
      });
    });

    return { adminPlayers, corePlayers };
  }
);

export const getCurrentMatch = createAsyncThunk(
  'match/getCurrentMatch',
  async (matchId) => {
    const docRef = doc(db, 'matches', matchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw `There was a problem finding the match you're looking for.`;
    }
  }
);

export const getMatchPlayers = createAsyncThunk(
  'match/getMatchPlayers',
  async (matchId) => {
    const players = [];

    const matchPlayersRef = collection(db, 'user_matches');
    const qMatchPlayers = query(
      matchPlayersRef,
      where('matchId', '==', matchId)
    );

    const matchPlayersSnap = await getDocs(qMatchPlayers);
    matchPlayersSnap.forEach((doc) => {
      const data = doc.data();
      players.push({
        playerId: data.playerId,
        paymentStatus: data.paymentStatus,
        playerStatus: data.playerStatus,
      });
    });

    return players;
  }
);

export const togglePaymentStatus = createAsyncThunk(
  'match/togglePaymentStatus',
  async (matchPlayerData) => {
    const playerId = matchPlayerData.playerId;
    const matchId = matchPlayerData.matchId;
    const updatedPaymentStatus = matchPlayerData.paymentStatus;
    const matchRef = doc(db, 'user_matches', `${playerId}_${matchId}`);

    await updateDoc(matchRef, {
      paymentStatus: updatedPaymentStatus,
    });

    return matchPlayerData;
  }
);

export const removeMatchPlayer = createAsyncThunk(
  'match/removeMatchPlayer',
  async (playerToRemove) => {
    const matchId = playerToRemove.matchId;
    const playerId = playerToRemove.playerId;
    const docId = `${playerId}_${matchId}`;

    await deleteDoc(doc(db, 'user_matches', docId));

    return playerToRemove;
  }
);

export const updatePlayerMatchStatus = createAsyncThunk(
  'match/updatePlayerStatus',
  async (dataToUpdate) => {
    const playerId = dataToUpdate.playerId;
    const matchId = dataToUpdate.matchId;
    const newStatus = dataToUpdate.newStatus;

    const userMatchRef = doc(db, 'user_matches', `${playerId}_${matchId}`);
    await updateDoc(userMatchRef, {
      playerStatus: newStatus,
    });

    return dataToUpdate;
  }
);

export const addPlayer = createAsyncThunk(
  'match/addPlayer',
  async (playerData) => {
    await setDoc(
      doc(db, 'user_matches', `${playerData.playerId}_${playerData.matchId}`),
      {
        matchId: playerData.matchId,
        playerId: playerData.playerId,
        paymentStatus: playerData.paymentStatus,
        playerStatus: playerData.playerStatus,
      }
    );

    return playerData;
  }
);

export const deleteMatch = createAsyncThunk(
  'match/deleteMatch',
  async (matchId) => {
    await deleteDoc(doc(db, 'matches', matchId));

    const q = query(
      collection(db, 'user_matches'),
      where('matchId', '==', matchId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (currentDoc) => {
      await deleteDoc(doc(db, 'user_matches', currentDoc.id));
    });

    return matchId;
  }
);

export const updateMatch = createAsyncThunk(
  'match/updateMatch',
  async (matchData) => {
    const matchId = matchData.id;

    await updateDoc(doc(db, 'matches', matchId), matchData);

    return matchData;
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setMatchDetails.fulfilled, (state, action) => {
      state.data = { ...state.data, ...action.payload };
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(setMatchDetails.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(setMatchDetails.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(getCurrentMatch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getCurrentMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getCurrentMatch.rejected, (state) => {
      state.failedToLoad = true;
      state.isLoading = false;
    });
    builder.addCase(inviteCorePlayers.fulfilled, (state, action) => {
      state.data = {
        ...state.data,
        players: [],
      };

      action.payload.adminPlayers.forEach((player) => {
        state.data.players.push({
          playerId: player.playerId,
          playerStatus: 'playing',
          paymentStatus: false,
        });
      });

      action.payload.corePlayers.forEach((player) => {
        state.data.players.push({
          playerId: player.playerId,
          playerStatus: 'invited',
          paymentStatus: false,
        });
      });

      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(inviteCorePlayers.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(inviteCorePlayers.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(getMatchPlayers.fulfilled, (state, action) => {
      state.data.players = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(getMatchPlayers.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(getMatchPlayers.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(togglePaymentStatus.fulfilled, (state, action) => {
      const currentPlayer = state.data.players.find(
        (player) => player.playerId === action.payload.playerId
      );
      if (currentPlayer) {
        currentPlayer.paymentStatus = action.payload.paymentStatus;
      }
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(togglePaymentStatus.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(togglePaymentStatus.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(removeMatchPlayer.fulfilled, (state, action) => {
      state.data.players = state.data.players.filter((p) => {
        return p.playerId !== action.payload.playerId;
      });
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(removeMatchPlayer.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(removeMatchPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(updatePlayerMatchStatus.fulfilled, (state, action) => {
      const player = state.data.players.find(
        (p) => p.playerId === action.payload.playerId
      );
      player.playerStatus = action.payload.newStatus;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(updatePlayerMatchStatus.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(updatePlayerMatchStatus.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(addPlayer.fulfilled, (state, action) => {
      state.data.players.push(action.payload);
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(addPlayer.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(addPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(deleteMatch.fulfilled, (state) => {
      state.data = initialState.data;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(deleteMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(deleteMatch.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
    builder.addCase(updateMatch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(updateMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(updateMatch.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const selectMatchIsLoading = (state) => state.match.isLoading;
export const selectCurrentMatch = (state) => state.match.data;

export const selectMatchPlayers = createSelector(
  selectCurrentMatch,
  (match) => {
    return match.players;
  }
);

export const selectMatchPlayersByStatus = createSelector(
  selectMatchPlayers,
  (matchPlayers) => {
    const playerStatus = {
      playing: [],
      notPlaying: [],
      waitlist: [],
      requested: [],
      invited: [],
    };
    if (matchPlayers) {
      for (const player of matchPlayers) {
        // add each player to playerStatus object by status
        playerStatus[player.playerStatus].push(player);
      }
    }

    return playerStatus;
  }
);

export default matchSlice.reducer;
