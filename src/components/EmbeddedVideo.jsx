/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ButtonAction from './ButtonAction';
import '../styles/components/EmbeddedVideo.scss';
import LikeIcon from '../assets/icons/LikeIcon';
import ShareIcon from '../assets/icons/ShareIcon';
import {
  actionSearchData,
  postView,
} from '../store/reducers/Video.actionCreators';
import {
  showFormAction,
  showRegisterForm,
} from '../store/reducers/Modals.reducer';
import { getLikeData, getLikeDatarest } from '../store/reducers/Auth.reducer';
import LikeIconOn from '../assets/icons/LikeIconOn';
import PublicModal from './PublicModal';

const EmbeddedVideo = () => {
  const { videoDetail } = useSelector((state) => state.VideoReducer);
  const { user } = useSelector((state) => state.AuthReducer);
  const { showForm } = useSelector((state) => state.ModalsReducer);
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [stateLike, setStateLike] = useState({
    like: false,
    numerLike: 0,
  });
  const shareLink = `http://localhost:3000${location.pathname}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (token !== null) {
      if (stateLike.like === true) {
        setStateLike({ like: false, numerLike: stateLike.numerLike - 1 });
        dispatch(getLikeDatarest({ videoId }));
      } else {
        setStateLike({ like: true, numerLike: stateLike.numerLike + 1 });
        dispatch(getLikeData({ videoId }));
      }
    }
  };

  const handleClick = (labelName) => {
    dispatch(actionSearchData(labelName));
    navigate('/videos/results', {
      state: labelName,
    });
  };

  const initialLoading = useRef(false);
  useEffect(() => {
    if (!initialLoading.current) {
      const sendData = () => {
        try {
          if (token === null) {
            setStateLike({ like: false, numerLike: videoDetail.likes });
          } else if (user && videoDetail) {
            const equal = user.likes?.filter((element) =>
              videoDetail.likesIds?.some((like) => like === element)
            );
            if (equal?.length !== 0 || equal !== undefined) {
              setStateLike({ like: true, numerLike: videoDetail.likes });
              if (videoDetail.likes === 0 || equal.length === 0) {
                setStateLike({ numerLike: videoDetail.likes, like: false });
              }
            } else if (videoDetail) {
              setStateLike({ ...stateLike, numerLike: videoDetail.likes });
            }
          } else {
            console.log('error en el iff de use efect');
          }
        } catch (error) {
          console.log('error en el useEffect', error);
        }
      };
      sendData();
      dispatch(postView({ videoId, user }));
      initialLoading.current = true;
    }
  }, [user, videoDetail, initialLoading]);
  const views = Math.round(videoDetail.visits?.length / 2);
  const onclickShare = () => {
    dispatch(showFormAction());
  };
  return (
    videoDetail && (
      <div className="container__userandvideo">
        <div className="userandvideo__videowrapper">
          <ReactPlayer
            className="videowrapper__video"
            url={videoDetail.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
        <div className="userandvideo__labels">
          {videoDetail?.labels?.map((label) => (
            <button
              type="button"
              onClick={() => handleClick(label.name)}
              key={label._id}
            >
              #{label.name}
            </button>
          ))}
        </div>
        <div className="userandvideo__primaryinfo">
          <div className="primaryinfo__title">
            <h2>{videoDetail.title}</h2>
          </div>
          <div className="primaryinfo__scope">
            <div className="scope__views">{`Visitas a este video ${views}`}</div>
            <div className="scope__buttons">
              <p>{stateLike.numerLike}</p>
              <div className="buttons__like">
                <ButtonAction
                  className="btn-action--like"
                  prependIcon={stateLike.like ? <LikeIconOn /> : <LikeIcon />}
                  type="submit"
                  np
                  handleClick={handleSubmit}
                />
              </div>
              <ButtonAction
                className="btn-action--toshare"
                prependIcon={<ShareIcon />}
                handleClick={onclickShare}
              />
            </div>
          </div>
        </div>
        <div className="userandvideo__secundaryinfo">
          <div className="secundaryinfo__scope">
            <div className="scope__user">
              <div className="user__image">
                <img src={videoDetail?.user?.avatarUrl} alt="perfil" />
              </div>
              <div className="user__profile">
                <p className="profile__name">{videoDetail?.user?.fullName}</p>
                <p className="profile__subscribers">334,000 suscriptiores</p>
              </div>
            </div>
            <div className="profile__buttons">
              <ButtonAction
                className="btn-action--join"
                content="UNIRSE"
                handleClick={() => dispatch(showRegisterForm())}
              />
              <ButtonAction
                className="btn-action--subscription"
                content="SUSCRIBIRSE"
              />
            </div>
          </div>
          <div className="secundaryinfo__description">
            {videoDetail.descriptions}
          </div>
        </div>
        <PublicModal
          opened={showForm}
          onClose={() => dispatch(showFormAction())}
          title="Compartir"
        >
          <textarea
            className="textarea-action--toshare"
            defaultValue={shareLink}
          />
        </PublicModal>
      </div>
    )
  );
};

export default EmbeddedVideo;
