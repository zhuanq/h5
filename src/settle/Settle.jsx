/**
 * Created by army8735 on 2018/8/8.
 */

'use strict';

import Step0 from './Step0.jsx';
import Step1 from './Step1.jsx';

let ajax;
let cacheKey = 'settle';
let currentPriority = 0;

class Settle extends migi.Component {
  constructor(...data) {
    super(...data);
    this.index = 0;
  }
  @bind index
  init() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    jsBridge.getPreference(cacheKey, function(cache) {
      if(cache) {
        try {
          self.setData(cache, 0);
        }
        catch(e) {}
      }
    });
    ajax = $net.postJSON('/h5/guide/settle', function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.setPreference(cacheKey, data);
        self.setData(data, 1);
      }
      else if(res.code === 1000) {
        self.isLogin = false;
        self.setData(null, 1);

        jsBridge.delPreference(cacheKey);
        $.cookie('isLogin', null);
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
    });
  }
  setData(data, priority) {
    priority = priority || 0;
    if(priority < currentPriority) {
      return;
    }
    currentPriority = priority;console.log(data.author);

    let self = this;
    let step0 = self.ref.step0;
    let step1 = self.ref.step1;
    step0.list = data.allSkills;
    if(data.author && data.author[0]) {
      step1.authorName = data.author[0].name;
      step1.input();
    }
  }
  next(list) {
    this.list = list;
    this.index = 1;
  }
  sub(name) {
    let self = this;
    let step1 = self.ref.step1;
    step1.enable = false;
    let skill = this.list.map((item) => {
      return item.id;
    });
    let skillName = this.list.map((item) => {
      return item.name;
    });
    $net.postJSON('/h5/guide/setSettle', {
      skill,
      name,
    }, function(res) {
      if(res.success) {
        let data = res.data;
        jsBridge.toast('恭喜你获得了转圈作者身份，并点亮了' + skillName.join('、') + '技能点~\n' +
          '你可以去右下角“我的”中进入你的主页进行相关编辑操作！\n' +
          '也欢迎登录网页端上传你的作品，增加相应的技能点！');
        jsBridge.popWindow({
          settle: true,
          authorId: data.authorId,
        });
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
        step1.enable = true;
      }
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      step1.enable = true;
    });
  }
  render() {
    return <div class="settle">
      <Step0 ref="step0"
             on-next={ this.next }
             @visible={ this.index === 0 }/>
      <Step1 ref="step1"
             on-next={ this.sub }
             @visible={ this.index === 1 }/>
    </div>;
  }
}

export default Settle;