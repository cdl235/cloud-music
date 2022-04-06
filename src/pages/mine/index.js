import React, { memo, useEffect, useState } from 'react'
import { NotLogin } from './style'
import { changeIsVisible } from '@/components/theme-login/store'
import { useDispatch } from 'react-redux'
import { Row, Col, Collapse } from 'antd';
import './index.css'
import { getUserSongList } from '../../service/user';
import { MainDetail } from '../song-detail/child-pages/song-detail-left/style';
import ThemeHeaderRcm from '@/components/theme-header-rcm'
import ThemePlayist from '@/components/theme-playlist'
import { getSongDetails, getSongListDetail } from '../../service/songs';
import { HeaderTitle } from '../song-detail/child-pages/song-detail-left/style';


const { Panel } = Collapse

export default memo(function JMMine () {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()
  let isLogin = localStorage.getItem('isLogin')
  const [create, setCreate] = useState([])
  const [hoarding, setHoarding] = useState([])
  const [songListDetail, setSongListDetail] = useState([])
  const [songHead, setSongHead] = useState({})

  useEffect(() => {
    if (isLogin) {
      getUserSongList(userId).then((res) => {
        const create = res?.playlist?.filter((item) => {
          return item.subscribed === false
        })
        console.log(create);
        setCreate(create)
        const hoarding = res.playlist.filter((item) => {
          return item.subscribed === true
        })
        setHoarding(hoarding)

        SongListDetail(create[0].id)
        SongDetails(create[0].id)
      })
    }


  }, [isLogin, userId])

  const renderRightSlot = (
    <span>
      播放：<em style={{ color: '#c20c0c' }}>{123}</em>次
    </span>
  )

  const SongListDetail = (id) => {
    getSongListDetail(id).then((res) => {
      setSongListDetail(res.songs)
    })
  }

  const SongDetails = (id) => {
    getSongDetails(id).then((res) => {
      setSongHead(res.playlist)
    })
  }



  return (
    <div>
      <NotLogin isLogin={isLogin} className="w980" >
        <div className="show-no-login">
          <div className="my_music inner" >
            <h2>登录云音乐</h2>
            <div className="my_music btn-login" onClick={() => {
              if (!isLogin) dispatch(changeIsVisible(true))
            }}>立即登录</div>
          </div>
        </div>
      </NotLogin>

      {
        isLogin ? <div className="w980" style={{ overflow: 'hidden' }}>
          <Row>
            <Col span={18} push={6} >
              <div className='mine_right'>
                {songHead ? <HeaderTitle className="flex">
                  <div className="conver-img">
                    <img src={songHead.coverImgUrl} alt="" />
                    <span className="image_cover"></span>
                  </div>
                  <div className="song-detail">
                    <div className="detail-title-wrapper">
                      <i className="icons"></i>
                      <h2 className="detail-title">{songHead.name}</h2>
                    </div>
                    <div className="avatar">
                      <div className="avatar-pic">
                        <img src={songHead.creator?.avatarUrl} alt="" />
                      </div>
                      <div className="avatar-name">{songHead.creator?.nickname}</div>
                      <div className="avatar-datetime">{songHead.createTime}创建</div>
                    </div>
                    <div className="label-warpper flex gap">
                      <span>标签: </span>
                      <div className="sprite_button favorite pointer" style={{ marginBottom: '5px' }} onClick={() => { }}>
                        <i className="sprite_button inner">
                          <em className="sprite_button favorite-icon"></em>
                          收藏歌单
                        </i>
                      </div>
                    </div>
                    <div className="description-info gap">
                      <div className="descript-detail">介绍: {songHead?.description}</div>
                    </div>
                  </div>
                </HeaderTitle> : ''}

                <MainDetail>
                  <ThemeHeaderRcm
                    className="gap"
                    title="歌曲列表"
                    showIcon={false}
                    right={renderRightSlot}
                  />
                  {songListDetail && <ThemePlayist playlist={songListDetail} />}
                </MainDetail>
              </div>
            </Col>
            <Col span={6} pull={18} className='mine_left'>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="我创建的歌单" key="1">
                  <ul className='mine_left_ul' >
                    {
                      create?.map((item, index) => {
                        return (
                          <li className='mine_left_li' key={item.id} onClick={(e) => {
                            SongListDetail(item.id)
                            SongDetails(item.id)
                          }}>
                            <img src={item.coverImgUrl} alt='' />
                            <div>
                              <p>{item.name}</p>
                              <p>{item.trackCount}首</p>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </Panel>

                <Panel header="我收藏的歌单" key="2">
                  <ul className='mine_left_ul'>
                    {
                      hoarding?.map((item) => {
                        return (
                          <li className='mine_left_li' key={item.id} >
                            <img src={item.coverImgUrl} alt='' />
                            <div>
                              <p>{item.name}</p>
                              <p>{item.trackCount}首</p>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </div> : ""
      }

    </div >
  )
})
