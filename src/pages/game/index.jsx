import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Video, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      index: 0,
      myAnwser: [],
      exactAnwser: '',
      isGameOver: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this._nextMovie();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //点击答案区域
  anwserClick = (index) => {
    const { myAnwser, isGameOver } = this.state;
    if (isGameOver) return false;
    for (let i = index; i < myAnwser.length; i++) {
      myAnwser[i] = '';
    }
    this.setState({
      myAnwser,
      index,
    });
  };

  //点击文字区域
  wordClick = (item) => {
    const { counterStore } = this.props.store;
    const { oneMovie } = counterStore;
    const { myAnwser, index, exactAnwser, isGameOver } = this.state;
    if (isGameOver) return false;
    myAnwser.splice(index, 1, item);
    this.setState({
      myAnwser,
      index: index + 1,
    });
    // todo 判断是否与正确答案一质
    if (myAnwser.join('').length === exactAnwser.length) {
      if (myAnwser.join('') === exactAnwser) {
        console.log('回答正确');
      } else {
        console.log('回答错误');
      }
      //结束
      this.setState({
        isGameOver: true,
      });
      counterStore.anwser({ words: myAnwser.join(''), movie_id: oneMovie.id });
    }
  };

  _nextMovie = async () => {
    //开始游戏
    this.setState({
      isGameOver: false,
    });
    const { counterStore } = this.props.store;
    await counterStore.getOneMovie();
    const { oneMovie } = counterStore;
    let myAnwser = new Array(oneMovie.title.length).fill('');
    this.setState({
      myAnwser,
      exactAnwser: oneMovie.title,
      index: 0,
    });
  };

  _watchMovieTitle = async () => {
    const { counterStore } = this.props.store;
    const { oneMovie } = counterStore;
    await counterStore.watchAnwser({ movie_id: oneMovie.id });
    const { exactAnwser, isWatch } = counterStore;
    if (isWatch) {
      this.setState({
        myAnwser: [...exactAnwser],
        isGameOver: true,
      });
    } else {
      Taro.showModal({
        title: '您的积分不足100',
        content: '查看电影名称需要100积分\n完成签到奖励100积分',
        confirmColor: '#FD2C57',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '../signin/index' });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    }
  };

  render() {
    const {
      counterStore: { oneMovie, point, words, isWatch },
    } = this.props.store;
    let poster =
      oneMovie.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_205,m_fast';
    const { myAnwser } = this.state;

    return (
      <View className='game'>
        <View className='movie-desc'>
          <Text className='desc'>{oneMovie.note}</Text>
        </View>
        <View className='movie-wrap'>
          <Video
            style='width: 100%;height:205px'
            src={oneMovie.url}
            poster={poster}
            initialTime='0'
            id='video'
            autoplay
            controls
            loop={false}
            muted={false}
            showFullscreenBtn
            showPlayBtn
            playBtnPosition='center'
            enableProgressGesture={false}
            showProgress={false}
          />
        </View>

        <View className='content-wrap at-row at-row__justify--between at-row__align--center'>
          <View
            className='see-anwser'
            onClick={this._watchMovieTitle.bind(this)}
          >
            查看电影名
          </View>
          <View className='coin-tip'>
            <View className='coin'>我的积分:{point}</View>
            <View className='tip'>从下面20个字中选出正确的片名</View>
          </View>
          <View className='next-movie' onClick={this._nextMovie.bind(this)}>
            猜下一部
          </View>
        </View>

        <View className='write-wrap '>
          <View className='anwser at-row at-row__justify--center'>
            {myAnwser.map((item, index) => {
              return (
                <View
                  key={index}
                  className='word'
                  onClick={this.anwserClick.bind(this, index)}
                >
                  {item}
                </View>
              );
            })}
          </View>

          {isWatch ? (
            <View className='options'>
              <Image
                className='gameover'
                src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/game-over.png'
              />
            </View>
          ) : (
            <View className='options at-row at-row--wrap at-row__justify--between'>
              {words?.map((item, index) => {
                return (
                  <View
                    className='word'
                    key={index}
                    onClick={this.wordClick.bind(this, item)}
                  >
                    {item}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Index;
