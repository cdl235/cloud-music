import React, { memo } from 'react';
import { NotLogin } from './style';
import { useDispatch } from 'react-redux';
import { changeIsVisible } from '@/components/theme-login/store';

export default memo(function JMMine () {
  const dispatch = useDispatch();
  let isLogin = false;
  return (
    <div>
      <NotLogin isLogin={isLogin} className="w980">
        <div className="show-no-login">
          <div className="not-login inner">
            <h2>登录网抑云音乐</h2>
            <div className="detail">
              你可以关注明星和好友品味他们的私房歌单
              通过他们的动态发现更多精彩音乐
            </div>
            <div className="not-login btn-login" onClick={() => {
              dispatch(changeIsVisible(true))
            }}>立即登录</div>
          </div>
        </div>
      </NotLogin>
    </div>
  );
});
