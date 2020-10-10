import React, { memo, useEffect, useState, useRef, useCallback } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { getSizeImage, formatDate, getPlayUrl } from '@/utils/format-utils.js'
import { Slider } from 'antd'
import { Control, Operator, PlayerbarWrapper, PlayerInfo } from './stye'
import { getSongDetailAction } from '../store/actionCreator'

export default memo(function JMAppPlayerBar() {
  // props/state
  const [currentTime, setCurrentTime] = useState(0) // 用于保存当前播放的时间
  const [isShowBar, setIsShowBar] = useState(false) // 是否显示音量播放条
  const [progress, setProgress] = useState(0) // 滑块进度
  const [isChanging, setIsChanging] = useState(false) // 是否正在滑动
  const [isPlaying, setIsPlaying] = useState(false) // 是否正在播放

  // redux hook
  const dispatch = useDispatch()
  const { currentSong } = useSelector(
    state => ({
      currentSong: state.getIn(['player', 'currentSong']),
    }),
    shallowEqual
  )

  // other hook
  const audioRef = useRef()
  useEffect(() => {
    dispatch(getSongDetailAction(167876))
  }, [dispatch])

  useEffect(() => {
    audioRef.current.src = getPlayUrl(currentSong.id)
  }, [currentSong])

  // other handle
  const picUrl = currentSong.al && currentSong.al.picUrl // 图片url
  const songName = currentSong.name // 歌曲名字
  const singerName = currentSong.ar && currentSong.ar[0].name //作者名字
  const duration = currentSong.dt //播放总时间

  // other function
  // 点击播放按钮后音乐
  function playMusic() {
    // 设置src属性
    setIsPlaying(!isPlaying)
    // 播放音乐
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    // 设置音量
    audioRef.current.volume = 0.7
  }

  // 歌曲播放触发
  function timeUpdate(e) {
    // 没有在滑动滑块时触发(默认时没有滑动)
    if (!isChanging) {
      setCurrentTime(e.target.currentTime * 1000)
      setProgress((currentTime / duration) * 100)
    }
  }

  // 滑动滑块时触发
  const sliderChange = useCallback(
    value => {
      // 滑动滑块时:更改标识变量为false(touch move for changing state),此时不会触发onTimeUpdate(歌曲播放事件)
      setIsChanging(true)
      // 更改"当前播放时间"要的是毫秒数: 241840(总毫秒)   1 * 241840 / 1000 241.84 / 60  4.016667
      const currentTime = (value / 100) * duration
      console.log(
        `当前播放时间(毫秒): ${currentTime}, duration(毫秒)${duration}`
      )
      setCurrentTime(currentTime)
      // 更改进度条值
      setProgress(value)
    },
    [duration]
  )

  // 手指抬起时触发
  const slideAfterChange = useCallback(
    value => {
      // 重新设置当前播放时长 value(进度)/100 * duration(总毫秒数) / 1000 得到当前播放的"秒数"
      const currentTime = ((value / 100) * duration) / 1000
      audioRef.current.currentTime = currentTime
      // 设置当前播放时间的state,设置的是'毫秒',所以需要*1000
      setCurrentTime(currentTime * 1000)
      setIsChanging(false)
    },
    [duration]
  )

  // 更改音量
  function changingVolume(value) {
    audioRef.current.volume = value / 100
  }

  return (
    <PlayerbarWrapper className="sprite_player">
      <div className="w980 content">
        <Control isPlaying={isPlaying}>
          <button className="sprite_player pre"></button>
          <button className="sprite_player play" onClick={playMusic}></button>
          <button className="sprite_player next"></button>
        </Control>
        <PlayerInfo>
          <a href="#/" className="image">
            <img src={getSizeImage(picUrl, 35)} alt="" />
          </a>
          <div className="play-detail">
            <div className="song-info">
              <a href="/songDetail" className="song-name">
                {songName}
              </a>
              <a href="/author" className="singer-name">
                {singerName}
              </a>
            </div>
            <Slider
              defaultValue={0}
              value={progress}
              onChange={sliderChange}
              onAfterChange={slideAfterChange}
            />
          </div>
          <div className="song-time">
            <span className="now-time">{formatDate(currentTime, 'mm:ss')}</span>
            <span className="total-time">
              {' '}
              / {duration && formatDate(duration, 'mm:ss')}
            </span>
          </div>
        </PlayerInfo>
        <Operator>
          <div className="left">
            <button className="sprite_player btn favor"></button>
            <button className="sprite_player btn share"></button>
          </div>
          <div className="right sprite_player">
            <button
              className="sprite_player btn volume"
              onClick={e => setIsShowBar(!isShowBar)}
            ></button>
            <button className="sprite_player btn loop"></button>
            <button className="sprite_player btn playlist">2</button>
          </div>
          <div
            className="sprite_player top-volume"
            style={{ display: isShowBar ? 'block' : 'none' }}
          >
            <Slider vertical defaultValue={70} onChange={changingVolume} />
          </div>
        </Operator>
      </div>
      <audio ref={audioRef} onTimeUpdate={timeUpdate} />
    </PlayerbarWrapper>
  )
})
