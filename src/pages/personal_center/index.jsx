import React, { Component } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
// import { AtIcon } from 'taro-ui';
import { AtList, AtListItem } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {
    const { authStore, counterStore } = this.props.store;
    authStore.getUserInfo();
    counterStore.getPointRecord();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _watchedHandle = () => {
    Taro.navigateTo({
      url: '../watched_movie/index',
    });
  };
  _guessedHandle = () => {
    Taro.navigateTo({
      url: '../guessed_movie/index',
    });
  };

  _loginOut = () => {
    const { authStore } = this.props.store;
    authStore.changeState({ isLogin: false });
    Taro.removeStorage({
      key: 'Authorization',
    });
    Taro.navigateBack({
      success: (res) => {
        console.log(res);
        Taro.showToast({ title: '退出成功' });
      },
    });
  };

  render() {
    const {
      authStore: { userinfo, point },
      counterStore: { pointRecord },
    } = this.props.store;
    return (
      <View className='personal'>
        <View className='user-info at-row at-row__align--center'>
          <Image
            className='avatar'
            src={
              userinfo.avatarUrl
                ? userinfo.avatarUrl
                : 'https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
            }
          />
          <View className='info at-col'>
            <View className='username'>
              {userinfo.nickName ? userinfo.nickName : '游客'}
            </View>
            <View className='coin'>积分:{point}</View>
          </View>
          <Button
            className='loginout at-col at-col__offset-2'
            onClick={this._loginOut.bind(this)}
          >
            退出登录
          </Button>
        </View>

        <AtList hasBorder={false} className='movie'>
          <AtListItem
            customStyle={{ backgroundColor: '#333' }}
            className='list-item'
            title='我查看的电影'
            arrow='right'
            iconInfo={{ size: 25, color: '#ffffff', value: 'heart' }}
            onClick={this._watchedHandle.bind(this)}
          />
          <AtListItem
            className='list-item'
            title='我猜对的电影'
            arrow='right'
            iconInfo={{ size: 25, color: '#ffffff', value: 'list' }}
            onClick={this._guessedHandle.bind(this)}
          />
          <Button className='contact-button' openType='contact'></Button>
          <AtListItem
            className='list-item'
            title='联系在线客服'
            arrow='right'
            iconInfo={{ size: 25, color: '#ffffff', value: 'message' }}
          />
        </AtList>
        <View className='coin-list'>
          <View className='list-title at-row at-row__justify--around at-row__align--center'>
            <View className='title-coin'>积分记录</View>
            <View className='title-price'>金额</View>
            <View className='title-time'>时间</View>
          </View>
          <View className='list-content'>
            {pointRecord.map(({ title, point, created_at }, index) => {
              return (
                <View
                  key={index}
                  className='list-detail at-row at-row__justify--around at-row__align--center'
                >
                  <View className='coin_in at-col'>{title}</View>
                  <View className='coin_num at-col'>{point}</View>
                  <View className='coin_time at-col'>{created_at}</View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
