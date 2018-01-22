/**
 * Created by army8735 on 2018/1/13.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

let WIDTH = $(window).width();
let isStart;
let isMove;
let sx;
let sy;
let dx;
let $c;
let $i1;
let $i2;
let $i3;
let loading;
let pos;
let uuid = 0;

function setTransform(dx) {
  $c.css('-webkit-transform', `translate3d(${dx},0,0)`);
  $c.css('transform', `translate3d(${dx},0,0)`);
}
function clearTransform() {
  $c.css('-webkit-transform', 'translate3d(0,0,0)');
  $c.css('transform', 'translate3d(0,0,0)');
}

class ImageView extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.list || [];
    self.index = self.props.index || 0;
    self.on(migi.Event.DOM, function() {
      $c = $(self.ref.c.element);
      $i1 = $(self.ref.i1.element);
      $i2 = $(self.ref.i2.element);
      $i3 = $(self.ref.i3.element);
    });
  }
  @bind list = []
  @bind index
  show() {
    $(this.element).removeClass('fn-hide');
    jsBridge.refreshState(false);
  }
  hide() {
    $(this.element).addClass('fn-hide');
    jsBridge.refreshState(true);
    this.emit('hide');
  }
  isHide() {
    return  $(this.element).hasClass('fn-hide');
  }
  setData(list, index) {
    let self = this;
    list = list || [];
    index = parseInt(index) || 0;
    self.list = list;
    self.index = index;
    $c.css('top', $(window).scrollTop() + 'px');
    self.show();
    // 优先预览图
    self.setImg(index);
  }
  setImg(index) {
    let self = this;
    let list = self.list;
    let data = list[index];
    let url = util.autoSsl(data.FileUrl);
    if(data.loaded || !data.preview) {
      ++uuid;
      $i2.find('img').attr('src', url || '/src/common/blank.png');
    }
    else {
      $i2.find('img').attr('src', data.preview);
      let cid = ++uuid;
      self.loadImg(url, function(res) {
        if(res && uuid === cid) {
          data.loaded = true;
          $i2.find('img').attr('src', url);
        }
      });
    }
    if(index) {
      if(list[index - 1].loaded || !list[index - 1].preview) {
        $i1.find('img').attr('src', list[index - 1].FileUrl || '/src/common/blank.png');
      }
      else {
        $i1.find('img').attr('src', list[index - 1].preview);
      }
    }
    else {
      $i1.find('img').attr('src', '/src/common/blank.png');
    }
    if(index < list.length - 1) {
      if(list[index + 1].loaded || !list[index + 1].preview) {
        $i3.find('img').attr('src', list[index + 1].FileUrl || '/src/common/blank.png');
      }
      else {
        $i3.find('img').attr('src', list[index + 1].preview);
      }
    }
    else {
      $i3.find('img').attr('src', '/src/common/blank.png');
    }
  }
  loadImg(url, cb) {
    if(!url) {
      return;
    }
    let img = document.createElement('img');
    img.style.position = 'absolute';
    img.style.left = '-9999rem;';
    img.style.top = '-9999rem';
    img.style.visibility = 'hidden';
    img.src = url;
    img.onload = function() {
      cb(true);
      document.body.removeChild(img);
    };
    img.onerror = function() {
      cb(false);
      document.body.removeChild(img);
    };
    document.body.appendChild(img);
  }
  click(e) {
    e.stopPropagation();
    this.hide();
  }
  start(e) {
    if(!loading && e.touches.length === 1) {
      isStart = true;
      sx = e.touches[0].pageX;
      sy = e.touches[0].pageY;
      $c.removeClass('transition');
      pos = [];
    }
  }
  move(e) {
    if(isMove) {
      e.preventDefault();
      let x = e.touches[0].pageX;
      dx = x - sx;
      setTransform(dx + 'px');
      pos.push({
        t: Date.now(),
        x,
      });
      if(pos.length > 5) {
        pos.shift();
      }
    }
    else if(isStart && e.touches.length === 1) {
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;
      dx = x - sx;
      if(Math.abs(dx) > Math.abs(y - sy)) {
        e.preventDefault();
        isMove = true;
        setTransform(dx + 'px');
        pos.push({
          t: Date.now(),
          x,
        });
        if(pos.length > 5) {
          pos.shift();
        }
      }
      else {
        isStart = false;
      }
    }
  }
  end() {
    let self = this;
    isStart = isMove = false;
    let change = false;
    let i;
    let ts;
    if(dx < -WIDTH >> 1) {
      if(self.index < self.list.length - 1) {
        change = true;
        i = ++self.index;
        ts = '-100%';
      }
    }
    else if(dx > WIDTH >> 1) {
      if(self.index) {
        change = true;
        i = --self.index;
        ts = '100%';
      }
    }
    else if(pos.length > 1 && Math.abs(dx) > 10) {
      for(let i = pos.length - 1; i > 0; i--) {
        let a = pos[i];
        let b = pos[i - 1];
        if(a.t - b.t > 30) {
          pos = pos.slice(i);
          break;
        }
      }
      if(pos.length > 1) {
        let now = Date.now();
        pos.push({
          t: now,
          x: pos[pos.length - 1].x,
        });
        let dt = Math.max(1, pos[pos.length - 1].t - pos[0].t);
        let dx2 = pos[pos.length - 1].x - pos[0].x;
        let rate = Math.abs(dx2) / dt;
        if(rate > 0.1) {
          if(dx2 > 0 && self.index) {
            change = true;
            i = --self.index;
            ts = '100%';
          }
          else if(dx2 < 0 && self.index < self.list.length - 1) {
            change = true;
            i = ++self.index;
            ts = '-100%';
          }
        }
      }
    }
    if(change) {
      $c.addClass('transition');
      setTransform(ts);
      loading = true;
      setTimeout(function() {
        $c.removeClass('transition');
        clearTransform();
        self.setImg(i);
        loading = false;
      }, 200);
      return;
    }
    $c.addClass('transition');
    $c.css('-webkit-transform', 'translate3d(0,0,0)');
    $c.css('transform', 'translate3d(0,0,0)');
  }
  clickDownload(e, vd) {
    e.stopPropagation();
    if(!util.isLogin()) {
      migi.eventBus.emit('NEED_LOGIN');
      return;
    }
    let url = $(vd.element).attr('rel');
    if(url && /^\/\//.test(url)) {
      url = location.protocol + url;
    }
    url = util.img(url);
    let name = url.replace(/^.*\//, '');
    jsBridge.download({
      url,
      name,
    });
  }
  clickLike(e) {
    e.stopPropagation();
    this.emit('like', this.list, this.index);
  }
  render() {
    return <div class="cp-imageview fn-hide">
      <div class="c" ref="c" onClick={ this.click }
           onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end } onTouchCancel={ this.end }>
        <div class="i1" ref="i1">
          <img src="/src/common/blank.png"/>
        </div>
        <div class="i2" ref="i2">
          <img src="/src/common/blank.png"/>
        </div>
        <div class="i3" ref="i3">
          <img src="/src/common/blank.png"/>
        </div>
      </div>
      <label>{ ((this.index || 0) + 1) + '/' + this.list.length }</label>
      <b class="download"
         rel={ this.list[this.index] && this.list[this.index].FileUrl }
         onClick={ this.clickDownload }/>
      <b class={ 'like' + (this.list[this.index] && this.list[this.index].ISLike ? ' has' : '') }
         onClick={ this.clickLike }/>
    </div>;
  }
}

export default ImageView;