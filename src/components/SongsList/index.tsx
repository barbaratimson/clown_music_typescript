import React, {useCallback, useEffect, useRef, useState} from "react";
import { PlaylistT, QueueT, TrackT } from "../../utils/types/types";
import { initQueue } from "../../store/playingQueueSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { useSearchParams } from "react-router-dom";
import Track from "../Track";
import { AnimatePresence, motion } from "framer-motion";

interface SongsListProps {
  tracks: Array<TrackT>;
  playlist?: PlaylistT;
  style?: any;
  hideControls?: boolean;
}

const SongsList = ({
  tracks,
  playlist,
  style,
  hideControls,
}: SongsListProps) => {
  const dispatch = useAppDispatch();
  const setPlayingQueue = (queue: QueueT) => dispatch(initQueue(queue));
  const playerState = useAppSelector((state: RootState) => state.player);
  const [filterQuery, setFilterQuery] = useSearchParams();
  const [offset, setOffset] = useState(20);
  const [dataToShow, setDataToShow] = useState<TrackT[]>([]);
  const loaderRef = useRef<any>();

  const setInitQueue = useCallback((tracks: Array<TrackT>) => {
    if (playlist) {
      const filter = filterQuery.getAll("genres");
      if (playerState.shuffle) {
        setPlayingQueue({
          playlist: playlist,
          queueTracks: tracks,
          filteredBy: filter ?? filter,
        });
      } else {
        setPlayingQueue({
          playlist: playlist,
          queueTracks: playlist.tracks,
          filteredBy: filter ?? filter,
        });
      }
    }
  },[filterQuery, playerState.shuffle, playlist]);

  const showNextData = (offset: number) => {
    if (offset <= tracks.length) {
      setOffset((prevState) => prevState + 40);
      return tracks.slice(0, offset);
    } else {
      return tracks;
    }
  };

  useEffect(() => {
    setOffset(20);
    if (playlist?.tracks) {
      setDataToShow(playlist?.tracks.slice(0, 20));
    }
  }, [tracks]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting) {
        setDataToShow(showNextData(offset));
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, [showNextData]);

  const trackVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <motion.div
        key={tracks[0]?.id}
        className="flex flex-col w-full gap-3 md:gap-4"
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {dataToShow?.map((song, index) => (
            <motion.div
              key={song.id}
              custom={index}
              variants={trackVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
            >
              <Track
                hideControls={hideControls}
                key={song.id}
                queueFunc={setInitQueue}
                track={song}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div
        ref={loaderRef}
        className={`w-full ${dataToShow?.length !== tracks.length ? "h-[2400px]" : "h-0"}`}
      ></div>
    </>
  );
};

export default SongsList;