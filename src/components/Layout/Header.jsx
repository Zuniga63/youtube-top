import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { sidebarToggle } from '../../store/reducers/Layout.actionCreator';

import ButtonAction from '../ButtonAction';
import SearchHeader from '../SearchHeader';

import iconYoutube from '../../assets/images/brand/icon.png';
import letterYoutube from '../../assets/images/brand/letter.png';
import BarsIcon from '../../assets/icons/BarsIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import VoiceIcon from '../../assets/icons/VoiceIcon';
import AppsIcon from '../../assets/icons/AppsIcon';
import VerticalDotsIcon from '../../assets/icons/VerticalDotsIcon';
import RegisterButton from '../RegisterButton';
import UserIcon from '../../assets/icons/UserIcon';
import { logout } from '../../store/reducers/Auth.actionCreator';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.AuthReducer);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="header">
      <div className="header__group">
        <div className="group__hamburger">
          <ButtonAction
            className="btn-action--toggle"
            prependIcon={<BarsIcon />}
            handleClick={() => dispatch(sidebarToggle())}
          />
        </div>
        <Link to="/">
          <div className="hamburger__logo">
            <img src={iconYoutube} alt="icon youtube" className="brand__icon" />
            <img
              src={letterYoutube}
              alt="letter youtube"
              className="brand__letter"
            />
          </div>
        </Link>
      </div>
      <div className="header__search">
        <SearchHeader />
        <ButtonAction
          className="btn-action--search"
          prependIcon={<SearchIcon />}
        />
        <ButtonAction
          className="btn-action--voice"
          prependIcon={<VoiceIcon />}
        />
      </div>
      <div className="header__user">
        <ButtonAction
          className="btn-action--appsconf"
          prependIcon={<AppsIcon />}
        />
        <ButtonAction
          className="btn-action--appsconf"
          prependIcon={<VerticalDotsIcon />}
        />
        {isAuth ? (
          <ButtonAction
            className="btn-action--login"
            content="LOGOUT"
            prependIcon={<UserIcon />}
            handleClick={handleLogout}
          />
        ) : (
          <RegisterButton />
        )}
      </div>
    </nav>
  );
}

export default Header;
