/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import net from '../common/net';
import util from '../common/util';
import Nav from './Nav.jsx';
import HotWork from '../component/hotwork/HotWork.jsx';
import HotAlbum from '../component/hotalbum/HotAlbum.jsx';
import HotAuthor from '../component/hotauthor/HotAuthor.jsx';
import Comments from './Comments.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import Background from '../component/background/Background.jsx';
import BotFn from '../component/botfn/BotFn.jsx';
import Work from './Work.jsx';
import Dynamics from './Dynamics.jsx';

class Author extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let inputCmt = self.ref.inputCmt;
      inputCmt.on('share', function() {
        if(!self.authorId) {
          return;
        }
        migi.eventBus.emit('SHARE', '/author/' + self.authorId);
      });
    });
  }
  @bind authorId
  @bind showHome
  @bind index
  @bind rid
  @bind cid
  load(authorId) {
    let self = this;
    self.authorId = authorId;
    self.ref.nav.authorId = authorId;
    net.postJSON('/h5/author/newIndex', { authorID: authorId }, function(res) {
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
    console.log(data.type);
    console.log(data.itemList);
    let self = this;
    self.ref.nav.setData(data.authorDetail, 1);
    if(data.authorDetail.ISSettled && data.homeDetail.Hot_Works_Items && data.homeDetail.Hot_Works_Items.length) {
      self.showHome = true;
      self.index = 0;
      self.ref.hotWork.list = data.homeDetail.Hot_Works_Items;
    }
    else {
      self.index = 1;
    }
    self.ref.hotAlbum.list = data.album;
    self.ref.hotAuthor.list = data.homeDetail.AuthorToAuthor;
    self.ref.dynamics.authorId = self.authorId;
    self.ref.dynamics.setData(data.dynamic);
    self.ref.comments.authorId = self.authorId;
    self.ref.comments.setData(data.commentData);
    self.ref.work.setData(data.type, data.itemList);
  }
  clickType(e, vd ,tvd) {
    let rel = tvd.props.rel;
    if(rel !== this.index) {
      this.index = rel;
    }
  }
  chooseSubComment(rid, cid, name, n) {
    let self = this;
    self.rid = rid;
    self.cid = cid;
    if(!n || n === '0') {
      jsBridge.pushWindow('/subcomment.html?type=2&id='
        + self.authorId + '&cid=' + cid + '&rid=' + rid, {
        title: '评论',
      });
    }
  }
  closeSubComment() {
    let self = this;
    self.rid = self.cid = null;
  }
  clickInput() {
    let self = this;
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
  }
  render() {
    return <div class="author">
      <Background ref="background"/>
      <Nav ref="nav"/>
      <ul class="index" onClick={ { li: this.clickType } }>
        <li class={ (this.showHome ? '' : 'fn-hide ') + (this.index === 0 ? 'cur' : '') } rel={ 0 }>主页</li>
        <li class={ this.index === 1 ? 'cur' : '' } rel={ 1 }>作品</li>
        <li class={ this.index === 2 ? 'cur' : '' } rel={ 2 }>动态</li>
        <li class={ this.index === 3 ? 'cur' : '' } rel={ 3 }>留言</li>
      </ul>
      <div class={ 'home' + (this.showHome && this.index === 0 ? '' : ' fn-hide') }>
        <h4>主打作品</h4>
        <HotWork ref="hotWork"/>
        <h4>相关专辑</h4>
        <HotAlbum ref="hotAlbum"/>
        <h4>合作关系</h4>
        <HotAuthor ref="hotAuthor"/>
      </div>
      <Work ref="work"
            @visible={ this.index === 1 }/>
      <Dynamics ref="dynamics"
                @visible={ this.index === 2 }/>
      <Comments ref="comments"
                on-chooseSubComment={ this.chooseSubComment }
                on-closeSubComment={ this.closeSubComment }
                @visible={ this.index === 3 }/>
      <InputCmt ref="inputCmt"
                placeholder={ '发表评论...' }
                readOnly={ true }
                on-click={ this.clickInput }/>
      <BotFn ref="botFn"/>
    </div>;
  }
}

export default Author;
