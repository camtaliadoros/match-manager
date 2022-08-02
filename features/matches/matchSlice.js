import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  data: {},
  isLoading: false,
  failedToLoad: false,
};

export const createMatch = createAsyncThunk(
  'match/createMatch',
  async (matchData) => {
    const docRef = await setDoc(doc(db, 'matches', matchData.id), {
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

    const admin = playerData.groupPlayers.admin;
    const core = playerData.groupPlayers.core;

    admin.forEach(async (player) => {
      await setDoc(doc(db, 'user_matches', `${player}_${matchId}`), {
        playerId: player,
        matchId: matchId,
        playerStatus: 'playing',
        paymentStatus: false,
      });
    });

    core.forEach(async (player) => {
      await setDoc(doc(db, 'user_matches', `${player}_${matchId}`), {
        playerId: player,
        matchId: matchId,
        playerStatus: 'notPlaying',
        paymentStatus: false,
      });
    });

    return playerData.groupPlayers;
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
    const players = {
      playing: [],
      notPlaying: [],
      waitlist: [],
      requested: [],
    };
    const matchPlayersRef = collection(db, 'user_matches');
    const qPlaying = query(
      matchPlayersRef,
      where('matchId', '==', matchId),
      where('playerStatus', '==', 'playing')
    );

    const queryPlayingSnap = await getDocs(qPlaying);
    queryPlayingSnap.forEach((doc) => {
      const data = doc.data();
      players.playing.push({
        playerId: data.playerId,
        paymentStatus: data.paymentStatus,
        playerStatus: data.playerStatus,
      });
    });

    const qNotPlaying = query(
      matchPlayersRef,
      where('matchId', '==', matchId),
      where('playerStatus', '==', 'notPlaying')
    );

    const queryNotPlayingSnap = await getDocs(qNotPlaying);
    queryNotPlayingSnap.forEach((doc) => {
      const data = doc.data();
      players.notPlaying.push({
        playerId: data.playerId,
        paymentStatus: data.paymentStatus,
        playerStatus: data.playerStatus,
      });
    });

    const qWaitlist = query(
      matchPlayersRef,
      where('matchId', '==', matchId),
      where('playerStatus', '==', 'waitlist')
    );

    const queryWaitlistSnap = await getDocs(qWaitlist);
    queryWaitlistSnap.forEach((doc) => {
      const data = doc.data();
      players.waitlist.push({
        playerId: data.playerId,
        paymentStatus: data.paymentStatus,
        playerStatus: data.playerStatus,
      });
    });

    const qRequested = query(
      matchPlayersRef,
      where('matchId', '==', matchId),
      where('playerStatus', '==', 'requested')
    );

    const queryRequestedSnap = await getDocs(qRequested);
    queryRequestedSnap.forEach((doc) => {
      const data = doc.data();
      players.requested.push({
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
  'group/removeMatchPlayer',
  async (playerToRemove) => {
    const matchId = playerToRemove.matchId;
    const playerId = playerToRemove.playerId;
    const docId = `${playerId}_${matchId}`;

    await deleteDoc(doc(db, 'user_matches', docId));

    return playerToRemove;
  }
);

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createMatch.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(createMatch.pending, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(createMatch.rejected, (state) => {
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
      state.data.players = {
        playing: action.payload.admin,
        notPlaying: action.payload.core,
      };

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
      const currentPlayer = state.data.players.playing.find(
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
      const playerPlaying = state.data.players.playing.findIndex(
        (player) => player.playerId === action.payload.playerId
      );
      if (playerPlaying) {
        state.data.players.playing.splice(playerPlaying, 1);
      }

      const playerWaitlist = state.data.players.waitlist.findIndex(
        (player) => player.playerId === action.payload.playerId
      );
      if (playerWaitlist) {
        state.data.players.waitlist.splice(playerWaitlist, 1);
      }

      const playerRequested = state.data.players.requested.findIndex(
        (player) => player.playerId === action.payload.playerId
      );
      if (playerRequested) {
        state.data.players.requested.splice(playerRequested, 1);
      }

      state.isLoading = false;
      state.failedToLoad = false;
    });
    builder.addCase(removeMatchPlayer, (state) => {
      state.isLoading = true;
      state.failedToLoad = false;
    });
    builder.addCase(removeMatchPlayer.rejected, (state) => {
      state.isLoading = false;
      state.failedToLoad = true;
    });
  },
});

export const {} = matchSlice.actions;
export const selectCurrentMatch = (state) => state.match.data;
export const selectMatchPlayers = (state) => state.match.data.players;
export const selectMatchIsLoading = (state) => state.match.isLoading;

export default matchSlice.reducer;
