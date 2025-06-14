import { createSlice } from "@reduxjs/toolkit";
import { PlaylistT, TrackT } from "../utils/types/types";
import { PlaylistInitState, SongInitState } from "./initialStates";

export interface PlaylistFilterState {
  genres: string[];
  excludeAlbums: boolean;
}

const initialState: PlaylistFilterState = {
  genres: [],
  excludeAlbums: false,
};

const PlaylistFilter = createSlice({
  name: "PlaylistFilter",
  initialState,
  reducers: {
    setPlaylistFilterGenresState(state, action) {
      state.genres = action.payload;
    },
    setPlaylistFilterAlbumsState(state, action) {
      state.excludeAlbums = action.payload;
    },
  },
});

export const { setPlaylistFilterGenresState,setPlaylistFilterAlbumsState } = PlaylistFilter.actions;
export default PlaylistFilter.reducer;
