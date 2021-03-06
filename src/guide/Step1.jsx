/**
 * Created by army on 2017/4/18.
 */

class Step1 extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.isShow = self.props.isShow;
    self.nickname = self.props.nickname;
    self.dis = !self.nickname || self.nickname.length < 4;
    self.authorState = self.props.authorState;
    self.sex = 0;
  }
  @bind isShow
  @bind sex
  @bind nickname
  @bind dis
  @bind sending
  click(e, vd, tvd) {
    var $o = $(tvd.element);
    if(!$o.hasClass('cur')) {
      this.sex = tvd.props.rel;
    }
  }
  input(e, vd) {
    this.dis = $(vd.element).val().length < 2;
  }
  next() {
    let self = this;
    if(self.sending) {
      return;
    }
    self.sending = true;
    $net.postJSON('/h5/my/guideNameAndSex', {
      nickname: self.nickname,
      sex: self.sex,
    }, function(res) {
      if(res.success) {
        self.emit('next');
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      self.sending = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      self.sending = false;
    });
  }
  show() {
    this.isShow = true;
  }
  hide() {
    this.isShow = false;
  }
  render() {
    return <div class={ 'step1' + (this.isShow ? '' : ' fn-hide') }>
      <div class="con">
        <b class="icon"/>
        <h2>欢迎来到转圈</h2>
        <h4>{ this.authorState === 2 ? '给马甲想个名字吧！' : '我是圈儿，请问该怎么称呼你呢？' }</h4>
        <input type="text"
               class="name"
               placeholder="不得少于2个字哦~"
               maxLength="8"
               onInput={ this.input }
               value={ this.nickname }/>
        <p class="qsex">请问是汉子还是妹子呢？</p>
        <ul class="sex"
            onClick={ { li: this.click } }>
          <li class={ 'male' + (this.sex === 1 ? ' cur' : '') }
              rel={ 1 }><span>汉子</span></li>
          <li class={ 'female' + (this.sex === 2 ? ' cur' : '') }
              rel={ 2 }><span>妹子</span></li>
        </ul>
      </div>
      <button class={ 'sub' + (this.dis || this.sending ? ' dis' : '') }
              onClick={ this.next }>就叫这个！</button>
    </div>;
  }
}

export default Step1;
