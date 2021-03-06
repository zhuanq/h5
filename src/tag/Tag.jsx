/**
 * Created by army8735 on 2017/12/24.
 */

'use strict';

import PostList from '../component/postlist/PostList.jsx';
import ImageView from '../component/imageview/ImageView.jsx';
import InputCmt from '../component/inputcmt/InputCmt.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';

let offset = 0;
let loading;
let loadEnd;
let ajax;

let currentPriority = 0;
let cacheKey;

class Tag extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      jsBridge.setOptionMenu({
        icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAHlBMVEUAAACMvuGMvuGMvuGNveGMvuGNweOPwuuMvuKLveG52ByYAAAACXRSTlMA7+bFiGY1GfMKDs4PAAAASklEQVRIx2MYBSMZlIbjl2eTnJiAVwHzzJkGeBVwzJzZQK4JCDcQ9MUoAAInFfzyLDNnOuBVwDRzpgK5ChBWEHTkKBjNeqNgWAAAQowW2TR/xN0AAAAASUVORK5CYII=',
      });
      jsBridge.on('optionMenu1', function() {
        let list = [
          [
            {
              class: 'wb',
              name: '微博',
              click: function(botPanel) {
                let url = window.ROOT_DOMAIN + '/tag/' + encodeURIComponent(self.tag);
                let text = '聊一聊【' + self.tag + '】吧~ 每天转转圈，玩转每个圈~';
                text += ' #转圈circling# ';
                text += url;
                jsBridge.shareWb({
                  text,
                }, function(res) {
                  if(res.success) {
                    jsBridge.toast("分享成功");
                  }
                  else if(res.cancel) {
                    jsBridge.toast("取消分享");
                  }
                  else {
                    jsBridge.toast("分享失败");
                  }
                });
              },
            },
            {
              class: 'link',
              name: '复制链接',
              click: function(botPanel) {
                $util.setClipboard(window.ROOT_DOMAIN + '/tag/' + encodeURIComponent(self.tag));
                botPanel.cancel();
              },
            }
          ]
        ];
        migi.eventBus.emit('BOT_PANEL', list);
      });
    });
  }
  @bind tag
  init(tag) {
    let self = this;
    self.tag = tag;
    cacheKey = 'tagName_' + tag;
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/tag/index', { tag }, function(res) {
      if(res.success) {
        let data = res.data;
        self.setData(data, 1);
        jsBridge.setPreference(cacheKey, data);

        window.addEventListener('scroll', function() {
          self.checkMore();
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;
    let self = this;
    let postList = self.ref.postList;

    postList.setData(data.postList.data);
    offset = data.postList.limit;
    if(offset === 0) {
      loadEnd = true;
      postList.message = '暂无信息';
    }
    else if(offset >= data.postList.count) {
      loadEnd = true;
      postList.message = '已经到底了';
    }
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let postList = self.ref.postList;
    loading = true;
    ajax = $net.postJSON('/h5/tag/postList', { tag: self.tag, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        if(data.data.length) {
          postList.appendData(data.data);
        }
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  comment() {
    jsBridge.pushWindow('/sub_post.html?tag=' + encodeURIComponent(this.tag), {
      title: '画个圈',
      showOptionMenu: 'true',
      optionMenu: '发布',
    });
  }
  render() {
    return <div class="tag">
      <h3>#{ this.tag }#</h3>
      <PostList ref="postList"
                visible={ true }
                message="正在加载..."/>
      <ImageView ref="imageView"/>
      <InputCmt ref="inputCmt"
                placeholder={ '画个圈吧！' }
                readOnly={ true }
                on-click={ this.comment }/>
      <BotPanel ref="botPanel"/>
    </div>;
  }
}

export default Tag;
