/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotMusicAlbum from '../component/hotmusicalbum/HotMusicAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import MAList from './MAList.jsx';
import PicList from './PicList.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotFn from '../component/botfn/BotFn.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.type = 0;
    self.on(migi.Event.DOM, function() {
      let inputCmt = self.ref.inputCmt;
      inputCmt.on('share', function() {
        migi.eventBus.emit('SHARE', '/author/' + self.authorId);
      });
      jsBridge.setOptionMenu({
        icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
      });
    });
  }
  @bind authorId
  @bind type
  @bind rid
  @bind cid
  load(authorId) {
    let self = this;
    self.authorId = authorId;
    self.ref.nav.authorId = authorId;
    net.postJSON('/h5/author/index', { authorID: authorId }, function(res) {
      if(res.success) {
        self.setData(res.data);
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
    });
  }
  setData(data) {
    let self = this;
    console.log(data);
    self.ref.nav.setData(data.authorDetail, 1);
    self.ref.hotWork.dataList = data.homeDetail.Hot_Works_Items;
    self.ref.hotMusicAlbum.dataList = data.album;
    self.ref.hotAuthor.dataList = data.homeDetail.AuthorToAuthor;

    return;
    self.hotPlayList = data.hotPlayList;
    self.album = data.album;
    self.hotPicList = data.hotPicList;
    self.commentData = data.commentData;

    if(!data.authorDetail.ISSettled) {
      self.type = [
        {
          cn: 'comments',
          name: '留言',
        }
      ];
    }
    else {
      let emptyHome = !data.album.length
        && !data.homeDetail.Hot_Works_Items.length
        && !data.homeDetail.AuthorToAuthor.length;
      let emptyAudio = !data.hotPlayList.Size;
      let emptyPic = !data.hotPicList.Size;
      let type = [];
      if(!emptyHome) {
        type.push({
          cn: 'home',
          name: '主页',
        });
      }
      if(!emptyAudio) {
        type.push({
          cn: 'ma',
          name: '音乐',
        });
      }
      if(!emptyPic) {
        type.push({
          cn: 'pic',
          name: '图片',
        });
      }
      type.push({
        cn: 'comments',
        name: '留言',
      });
      self.type = type;
    }
    switch(self.type[0].cn) {
      case 'home':
        self.ref.home = <Home ref="home"
                              homeDetail={ data.homeDetail }
                              album={ data.album }/>;
        self.ref.home.show();
        self.ref.home.after(self.ref.type.element);
        break;
      case 'ma':
        self.ref.maList = <MAList ref="maList"
                                  authorId={ self.authorId }
                                  dataList={ data.hotPlayList }/>;
        self.ref.maList.show();
        self.ref.maList.after(self.ref.type.element);
        break;
      case 'pic':
        self.ref.picList = <PicList ref="picList"
                                    authorId={ self.authorId }
                                    dataList={ data.hotPicList }/>;
        self.ref.picList.show();
        self.ref.picList.after(self.ref.type.element);
        break;
      case 'comments':
        self.addComment(self.commentData);
        break;
    }

    let inputCmt = self.ref.inputCmt;
    inputCmt.on('click', function() {
      if(self.cid) {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorId + '&cid=' + self.cid + '&rid=' + self.rid, {
          title: '评论',
        });
      }
      else {
        jsBridge.pushWindow('/subcomment.html?type=2&id=' + self.authorId, {
          title: '评论',
        });
      }
    });
  }
  clickType(e, vd ,tvd) {
    let self = this;
    if(tvd.props.rel === self.type) {
      return;
    }
    self.type = tvd.props.rel;
    // let $li = $(tvd.element);
    // if($li.hasClass('cur')) {
    //   return;
    // }
    // $(vd.element).find('.cur').removeClass('cur');
    // $li.addClass('cur');
    // let self = this;
    // let home = self.ref.home;
    // let maList = self.ref.maList;
    // let picList = self.ref.picList;
    // let comments = self.ref.comments;
    // home && home.hide();
    // maList && maList.hide();
    // picList && picList.hide();
    // comments && comments.hide();
    // let rel = tvd.props.rel;
    // switch(rel) {
    //   case 'home':
    //     home.show();
    //     break;
    //   case 'ma':
    //     if(!maList) {
    //       self.ref.maList = maList = <MAList ref="maList"
    //                                          authorId={ self.authorId }
    //                                          dataList={ self.hotPlayList }/>;
    //       maList.after(self.ref.type.element);
    //     }
    //     maList.show();
    //     break;
    //   case 'pic':
    //     if(!picList) {
    //       self.ref.picList = picList = <PicList ref="picList"
    //                                             authorId={ self.authorId }
    //                                             dataList={ self.hotPicList }/>;
    //       picList.after(self.ref.type.element);
    //     }
    //     picList.show();
    //     break;
    //   case 'comments':
    //     self.addComment();
    //     comments && comments.show();
    //     break;
    // }
  }
  addComment() {
    let self = this;
    if(self.ref.comments) {
      return;
    }
    let comments = self.ref.comments = migi.render(
      <Comments ref="comments"
                isLogin={ util.isLogin() }
                authorId={ self.authorId }
                commentData={ self.commentData }/>
    );
    self.ref.comments.after(self.ref.type.element);

    let comment = comments.ref.comment;
    let subCmt = self.ref.subCmt;
    comment.on('chooseSubComment', function(rid, cid, name, n) {
      self.rid = rid;
      self.cid = cid;
      if(!n || n === '0') {
        jsBridge.pushWindow('/subcomment.html?type=2&id='
          + self.authorId + '&cid=' + cid + '&rid=' + rid, {
          title: '评论',
        });
      }
    });
    comment.on('closeSubComment', function() {
      subCmt.to = '';
      self.rid = self.cid = null;
    });
  }
  render() {
    return <div class="author">
      <Background ref="background"/>
      <Nav ref="nav"/>
      <ul class="type" ref="type" onClick={ { li: this.clickType } }>
        <li class={ (this.type === 0 ? 'cur' : '') } rel={ 0 }>主页</li>
        <li class={ (this.type === 1 ? 'cur' : '') } rel={ 1 }>作品</li>
        <li class={ (this.type === 2 ? 'cur' : '') } rel={ 2 }>留言</li>
      </ul>
      <div class={ 'home' + (this.type === 0 ? '' : ' fn-hide') }>
        <h4>主打作品</h4>
        <HotWork ref="hotWork"/>
        <h4>相关专辑</h4>
        <HotMusicAlbum ref="hotMusicAlbum"/>
        <h4>合作关系</h4>
        <HotAuthor ref="hotAuthor"/>
      </div>
      <InputCmt ref="inputCmt" placeholder={ '发表评论...' } readOnly={ true }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Author;
