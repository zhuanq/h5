/**
 * Created by army8735 on 2018/4/5.
 */


'use strict';

import Banner from './Banner.jsx';
import Works from './Works.jsx';
import AuthorList from './AuthorList.jsx';
import WorksList from './WorksList.jsx';
import Post from './Post.jsx';
import VideoList from '../component/videolist/VideoList.jsx';
import Playlist from '../component/playlist/Playlist.jsx';
import WaterFall from '../component/waterfall/WaterFall.jsx';

class Item extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.message = self.props.message;
    self.tag = self.props.tag;
    self.kind = self.props.kind;
    self.offset = 0;
    self.on(migi.Event.DOM, () => {
      let $con = $(self.ref.con.element);
      $con.on('click', 'a', function(e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.attr('href');
        let title = $this.attr('title');
        jsBridge.pushWindow(url, {
          title,
          transparentTitle: true,
        });
      });
    });
  }
  @bind visible
  @bind message
  setData(data) {
    let self = this;
    self.cache = [];
    self.ref.banner.setData(data.banner);

    let s = '';
    let list = [];
    data.list.data.forEach(function(item) {
      let o = self.genItem(item);
      if(o) {
        list.push(o);
        s += o;
      }
    });
    $(self.ref.con.element).html(s);
    list.forEach((item) => {
      item.emit(migi.Event.DOM);
    });

    self.offset = data.list.limit;
    if(self.kind) {
      self.loadEnd = self.offset >= data.kindList.count;
    }
    else {
      self.loadEnd = self.offset >= data.list.count;
    }
  }
  appendData(data) {
    if(!data) {
      return;
    }
    let self = this;
    let s = '';
    let list = [];
    if(!Array.isArray(data)) {
      data = [data];
    }
    data.forEach(function(item) {
      let o = self.genItem(item);
      if(o) {
        list.push(o);
        s += o;
      }
    });
    $(self.ref.con.element).append(s);
    list.forEach((item) => {
      item.emit(migi.Event.DOM);
    });
  }
  genItem(item) {
    if(!item.content) {
      return;
    }
    switch(item.type) {
      case 1:
        return <Works data={item}/>;
      case 2:
        return <Works data={item}
                      type={ 2 }/>;
      case 3:
        return <Works data={item}
                      type={ 3 }/>;
      case 4:
        return <AuthorList data={item}/>;
      case 5:
        return <WorksList data={item}/>;
      case 6:
        return <Post data={ item }/>;
    }
  }
  checkMore() {
    let self = this;
    if(self.loading || self.loadEnd || !self.visible) {
      return;
    }
    if($util.isBottom()) {
      self.load();
      $net.statsAction(11, {
        tag: self.tag,
      });
    }
  }
  load() {
    let self = this;
    if(self.ajax) {
      self.ajax.abort();
    }
    self.loading = true;
    self.ajax = $net.postJSON('/h5/find/tag',
      { tag: self.tag, kind: self.kind, offset: self.offset, }, function(res) {
      if(res.success) {
        let data = res.data;
        let banner = data.banner;
        let list = data.list;
        let kindList = data.kindList;
        if(banner) {
          self.ref.banner.setData(banner);
        }
        if(list) {
          self.appendData(list.data);
        }
        if(self.kind && kindList) {
          switch(self.kind) {
            case 1:
              if(self.offset) {
                self.ref.videoList.appendData(kindList.data);
              }
              else {
                self.ref.videoList.visible = true;
                self.ref.videoList.setData(kindList.data);
              }
              break;
            case 2:
              if(self.offset) {
                self.ref.playlist.appendData(kindList.data);
              }
              else {
                self.ref.playlist.visible = true;
                self.ref.playlist.setData(kindList.data);
              }
              break;
            case 3:
              if(self.offset) {
                self.ref.waterFall.appendData(kindList.data);
              }
              else {
                self.ref.waterFall.visible = true;
                self.ref.waterFall.setData(kindList.data);
              }
              break;
          }
          self.offset += kindList.limit;
          if(self.offset >= kindList.count) {
            self.loadEnd = true;
            self.message = '已经到底了';
          }
        }
        else {
          self.offset += list.limit;
          if(self.offset >= list.count) {
            self.loadEnd = true;
            self.message = '已经到底了';
          }
        }
      }
      else {
        if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        }
      }
      self.loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.loading = false;
    });
  }
  change(data) {
    let work = data.work;
    work.worksId = data.id;
    work.worksTitle = data.title;
    work.worksCover = data.cover;
    $util.recordPlay(work);
    $net.postJSON('/h5/work/addViews', { id: work.id });
    let author = [];
    let hash = {};
    (data.work.author || []).forEach(function(item) {
      item.list.forEach(function(at) {
        if(!hash[at.id]) {
          hash[at.id] = true;
          author.push(at.name);
        }
      });
    });
    jsBridge.media({
      key: 'play',
      value: {
        id: work.id,
        url: location.protocol + $util.autoSsl(work.url),
        title: data.title,
        author: author.join(' '),
        cover: $util.protocol($util.img(data.cover, 80, 80, 80)),
      },
    });
  }
  render() {
    return <div class={ 'mod-item' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      <div ref="con"/>
      {
        this.kind === 1
          ? <VideoList ref="videoList"/>
          : ''
      }
      {
        this.kind === 2
          ? <Playlist ref="playlist"
                      on-change={ this.change }/>
          : ''
      }
      {
        this.kind === 3
          ? <WaterFall ref="waterFall"/>
          : ''
      }
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default Item;
