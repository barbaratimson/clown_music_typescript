import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { RootState, useAppSelector } from "../../store";
import { Delete, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import axios from "axios";
import { link } from "../../utils/constants";
import "./PlaylistInfo.scss";
import { PlaylistT } from "../../utils/types/types";
import { Popper } from "@mui/material";
import Button from "../UI/Button/Button";
import {
  deviceState,
  getIsMobile,
  handleSubscribe,
  onSubscribe,
} from "../../utils/deviceHandler";
import { ContextMenu } from "../UI/ContextMenu/ContextMenu";
import {
  setPlaylistFilterAlbumsState,
  setPlaylistFilterGenresState,
} from "../../store/playlistFilterSlice";

interface PlaylistInfoProps {
  playlist: PlaylistT;
}

interface GenreCountT {
  genre: string;
  amount: number;
  percentage: number;
}

const PlaylistInfo = ({ playlist }: PlaylistInfoProps) => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams("");
  const [filterMenuActive, setFilterMenuActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [albumMenuActive, setAlbumMenuActive] = useState(false);
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
  const [isMobile, setIsMobile] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLDivElement>(null);

  useEffect(() => {
    const artists = playlist.tracks.map((track) => {
      if (track.artists.length !== 0) {
        return track.artists;
      }
    });
    const uniqueArtists = Array.from(new Set(artists)).flat(1);

    const genres = playlist.tracks.map((track) => {
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
  }, [playlist]);

  useEffect(() => {
    const getIsMobileInfo = () => {
      handleSubscribe();
      onSubscribe();
      setIsMobile(getIsMobile(deviceState));
    };
    getIsMobileInfo();
  }, []);

  return (
    <>
      <div className="playlist__popper_wrapper">
        <div
          className="track-info-mobile-controls-wrapper animated-opacity-4ms"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="track-info-mobile-control-button"
            onClick={(e) => {
              setFilterMenuActive(!filterMenuActive);
              setAlbumMenuActive(false);
              setAnchorEl(e.currentTarget);
            }}
          >
            <>
              <div className="track-info-mobile-control-icon">
                <FilterAlt />
              </div>
              <div className="track-info-mobile-control-label">Filter</div>
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
          {/*{playlist.owner.uid === currentUser.user?.account?.uid && playlist.kind !== 3 ? (*/}
          {/*    <div className="track-info-mobile-control-button" onClick={() => {*/}
          {/*        // removePlaylist(playlist.kind)*/}
          {/*        console.log("Delete playlist")*/}
          {/*    }}>*/}
          {/*        <div className="track-info-mobile-control-icon">*/}
          {/*            <Delete/>*/}
          {/*        </div>*/}
          {/*        <div className="track-info-mobile-control-label">*/}
          {/*            Remove playlist*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*) : null}*/}
        </div>
      </div>
      {!isMobile && (
        <ContextMenu
          active={filterMenuActive}
          setActive={setFilterMenuActive}
          position={"left-start"}
          anchorEl={anchorEl}
        >
          <PlaylistFilters
            genres={genres}
            filterAlbums={filterAlbums}
            setFilterAlbums={setFilterAlbums}
            genresToFilter={genresToFilter}
            setGenresToFilter={setGenresToFilter}
          />
        </ContextMenu>
      )}
    </>
  );
};

interface PlaylistFiltersProps {
  genres: GenreCountT[] | undefined;
  genresToFilter: string[];
  setGenresToFilter: (genres: string[]) => void;
  filterAlbums: boolean;
  setFilterAlbums: (albums: boolean) => void;
}

const PlaylistFilters = ({
  setFilterAlbums,
  setGenresToFilter,
  genres,
  filterAlbums,
  genresToFilter,
}: PlaylistFiltersProps) => {
  return (
    <>
      <div
        className="playlist-filter__wrapper p-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={`playlist-filter__button  ${filterAlbums ? "active" : ""}`}
          onClick={() => {
            setFilterAlbums(!filterAlbums);
          }}
        >
          <div className="playlist-filter__button_text">Exclude Albums</div>
        </div>
        {!filterAlbums && genres?.map((genreRender) => (
          <div
            key={genreRender.genre}
            className={`playlist-filter__button  ${genresToFilter.includes(genreRender.genre) ? "active" : ""}`}
            onClick={() => {
              !genresToFilter?.includes(genreRender.genre)
                ? setGenresToFilter([...genresToFilter, genreRender.genre])
                : setGenresToFilter(
                    genresToFilter.filter((elem) => elem !== genreRender.genre),
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
                  (genreRender.percentage * 100) / genres[0].percentage + "%",
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
  );
};

export default PlaylistInfo;
