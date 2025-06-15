import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { RootState, useAppSelector } from "../../../store";
import {
  Add,
  Close,
  Delete,
  ExpandMore,
  FilterAlt,
  FilterAltOff,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import Cover, { ImagePlaceholder } from "../../UI/Cover";
import { setPlaylistInfoActiveState } from "../../../store/playlistInfoSlice";
import PopUpModal from "../../UI/PopUpModal";
import axios from "axios";
import { link } from "../../../utils/constants";
import "./style.scss";
import { PlaylistT } from "../../../utils/types/types";
import { getCMImageUrl } from "../../../utils/cmApiRequsts";
import Button from "../../UI/Button/Button";
import {
  setPlaylistFilterAlbumsState,
  setPlaylistFilterGenresState,
} from "../../../store/playlistFilterSlice";

interface GenreCountT {
  genre: string;
  amount: number;
  percentage: number;
}

const MobilePlaylistInfo = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams("");
  const playlistInfoState = useAppSelector(
    (state: RootState) => state.playlistInfo,
  );
  const setPlaylistInfoShow = (active: boolean) =>
    dispatch(setPlaylistInfoActiveState(active));
  const [filterMenuActive, setFilterMenuActive] = useState(false);
  const currentSong = useAppSelector(
    (state: RootState) => state.CurrentSongStore.currentSong,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState<GenreCountT[]>();
  const genresToFilter = useAppSelector(
      (state) => state.playlistFilters.genres,
  );
  const filterAlbums = useAppSelector(
    (state) => state.playlistFilters.excludeAlbums,
  );
  const setFilterAlbums = (excludeAlbums: boolean) =>
    dispatch(setPlaylistFilterAlbumsState(excludeAlbums));
  const setGenresToFilter = (genres: string[]) =>
    dispatch(setPlaylistFilterGenresState(genres));
  const navigate = useNavigate();
  const currentUser = useAppSelector((state: RootState) => state.user);
  const [userPlaylists, setUserPlaylists] = useState<PlaylistT[]>();

  const addPlaylist = async (playlistId: number) => {
    try {
      const response = await axios.get(
        `${link}/ya/playlist/${playlistId}/add`,
        { headers: { Authorization: localStorage.getItem("Authorization") } },
      );
      console.log(response.data);
    } catch (err) {
      console.error("Ошибка при получении списка треков:", err);
    }
  };

  const removePlaylist = async (playlistId: number) => {
    try {
      const response = await axios.get(
        `${link}/ya/playlist/${playlistId}/remove`,
        { headers: { Authorization: localStorage.getItem("Authorization") } },
      );
      console.log(response.data);
      if (response.data === "ok") {
        navigate(-1);
      }
    } catch (err) {
      console.error("Ошибка при получении списка треков:", err);
    }
  };
  const fetchUserPlaylists = async () => {
    try {
      const response = await axios.get(`${link}/ya/playlists`, {
        headers: { Authorization: localStorage.getItem("Authorization") },
      });
      setUserPlaylists(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Ошибка при получении списка треков:", err);
    }
  };

  const genresHandler = () => {};

  useEffect(() => {
    fetchUserPlaylists();
    const artists = playlistInfoState.playlist.tracks.map((track) => {
      if (track.artists.length !== 0) {
        return track.artists;
      }
    });
    const uniqueArtists = Array.from(new Set(artists)).flat(1);

    const genres = playlistInfoState.playlist.tracks.map((track) => {
      if (track.genre !== undefined) {
        return track.genre;
      } else {
        return "Unknown";
      }
    });
    const uniqueGenres = Array.from(new Set(genres));
    const countAmount = uniqueGenres.map((genre) => {
      const amountOfGenre = genres.filter((elem) => elem == genre);
      const genrePecentage = (amountOfGenre.length * 100) / genres.length;
      return {
        genre: genre,
        amount: amountOfGenre.length,
        percentage: genrePecentage,
      };
    });
    setGenres(countAmount.sort((a, b) => b.amount - a.amount));
  }, [playlistInfoState.playlist]);

  return (
    <>
      <PopUpModal
        active={playlistInfoState.active}
        setActive={setPlaylistInfoShow}
      >
        <>
          {playlistInfoState.playlist ? (
            <>
              <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                <Cover
                  placeholder={<ImagePlaceholder size="medium" />}
                  src={getCMImageUrl(
                    playlistInfoState.playlist.cover?.id,
                    "120x120",
                  )}
                  size="75x75"
                  imageSize="200x200"
                />
                <div className="track-info-wrapper">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="track-info-title mobile"
                  >
                    {playlistInfoState.playlist.name}
                  </div>
                  <div
                    style={{ marginTop: "5px" }}
                    className="track-info-artist"
                  >
                    {playlistInfoState.playlist.tracks.length + " tracks"}
                  </div>
                </div>
                <div className="track-info-back-button">
                  <KeyboardArrowDown className="track-info-back-icon" />
                </div>
              </div>
              <div
                className="track-info-mobile-controls-wrapper animated-opacity-4ms"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="track-info-mobile-control-button"
                  onClick={() => {
                    setFilterMenuActive(!filterMenuActive);
                    setPlaylistInfoShow(false);
                  }}
                >
                  <>
                    <div className="track-info-mobile-control-icon">
                      <FilterAlt />
                    </div>
                    <div className="track-info-mobile-control-label">
                      Filter
                    </div>
                    {genresToFilter.length !== 0 || !filterAlbums || (
                      <Button
                        className="track-info-mobile-control-label additional"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGenresToFilter([]);
                          setFilterAlbums(false);
                        }}
                      >
                        <FilterAltOff />
                      </Button>
                    )}
                  </>
                </div>

                {/*{playlistInfoState.playlist.owner.uid === currentUser.user?.account?.uid && playlistInfoState.playlist.kind !== 3 ? (*/}
                {/*    <div className="track-info-mobile-control-button" onClick={() => {*/}
                {/*        // removePlaylist(playlistInfoState.playlist.kind)*/}
                {/*        console.log("Delete playlist")*/}
                {/*    }}>*/}
                {/*        <div className="track-info-mobile-control-icon">*/}
                {/*            <Delete/>*/}
                {/*        </div>*/}
                {/*        <div className="track-info-mobile-control-label">*/}
                {/*            Remove playlist*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*):null}*/}
              </div>
            </>
          ) : null}
        </>
      </PopUpModal>

      <PopUpModal active={filterMenuActive} setActive={setFilterMenuActive}>
        <>
          <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
            <Cover
              placeholder={<ImagePlaceholder size="medium" />}
              src={getCMImageUrl(
                playlistInfoState.playlist.cover?.id,
                "120x120",
              )}
              size="75x75"
              imageSize="200x200"
            />
            <div className="track-info-wrapper">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="track-info-title mobile"
              >
                {playlistInfoState.playlist.name}
              </div>
              <div style={{ marginTop: "5px" }} className="track-info-artist">
                {playlistInfoState.playlist.tracks.length + " tracks"}
              </div>
            </div>
            <div className="track-info-back-button">
              <KeyboardArrowDown
                className="track-info-back-icon"
                style={{ rotate: "90deg" }}
              />
            </div>
          </div>
          <div
            className="playlist-filter__wrapper"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className={`playlist-filter__button  ${filterAlbums ? "active" : ""}`}
              onClick={() => {
                !filterAlbums
                  ? setFilterAlbums(true)
                  : setFilterAlbums(false);
              }}
            >
              <div className="playlist-filter__button_text">Exclude Albums</div>
            </div>
            {!filterAlbums && genres?.map((genreRender) => (
              <div
                key={genreRender.genre}
                className={`playlist-filter__button  ${genresToFilter.find(x => x === genreRender.genre) ? "active" : ""}`}
                onClick={() => {
                  !genresToFilter.find(x => x === genreRender.genre)
                    ? // setFilterQuery({ genre: [genreRender.genre })
                      setGenresToFilter([...genresToFilter, genreRender.genre])
                    : setGenresToFilter(
                        genresToFilter.filter(
                          (elem) => elem !== genreRender.genre,
                        ),
                      );
                }}
              >
                <div className="playlist-filter__button_text">
                  {genreRender.genre
                    ? genreRender.genre.charAt(0).toUpperCase() +
                      genreRender.genre.slice(1)
                    : null}
                </div>
                <div
                  className="playlist-filter__button_amount"
                  style={{
                    width:
                      (genreRender.percentage * 100) / genres[0].percentage +
                      "%",
                  }}
                >
                  <div className="playlist-filter__button_amount_number">
                    {genreRender.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </PopUpModal>
    </>
  );
};

export default MobilePlaylistInfo;
