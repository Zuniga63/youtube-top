/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import {
  fetchFilterVideos,
  resetState,
} from '../store/reducers/Video.actionCreators';

const VideoResults = () => {
  const location = useLocation();
  const searchInput = location.state;

  const { filtersVideo } = useSelector((state) => state.VideoReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilterVideos(searchInput));

    return () => {
      dispatch(resetState());
    };
  }, [searchInput, dispatch]);

  return filtersVideo.length > 0 ? (
    <div className="card__container">
      {filtersVideo.map((filtervideo) => (
        <Card
          key={filtervideo._id}
          video={filtervideo}
          className="videofilter__container"
          isSearch
        />
      ))}
    </div>
  ) : (
    <div className="card__container">
      No se encontraron videos con ete criterio de: {searchInput}
    </div>
  );
};

export default VideoResults;
