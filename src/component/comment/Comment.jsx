/**
 * Created by army on 2017/7/1.
 */
 
class Comment extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
  }
  slide(e, vd, tvd) {
    let $slide = $(tvd.element);
    let $li = $slide.closest('li');
    let $list2 = $li.find('.list2');
    let $ul = $list2.find('ul');
    if($slide.hasClass('on')) {
      $slide.removeClass('on');
      $list2.css('height', 0);
    }
    else {
      $slide.addClass('on');
      $list2.css('height', $ul.height());
    }
  }
  render() {
    return <div class="cp_comment">
      <div class="bar fn-clear">
        <ul class="type fn-clear" onClick={ this.switchType }>
          <li class="cur"><span>最热</span></li>
          <li><span>最新</span></li>
        </ul>
      </div>
      <ul class="list" onClick={ { '.slide': this.slide } }>
        <li>
          <div class="t">
            <div class="profile">
              <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
              <div class="txt">
                <div><span class="name">海妖小马甲</span><small class="time">3小时前</small></div>
                <p>我是个马甲</p>
              </div>
            </div>
            <div class="fn">
              <span class="zan has"><small>66</small></span>
            </div>
          </div>
          <div class="c">
            <pre>前排支持<span class="placeholder"></span></pre>
            <div class="slide"><small></small><span>收起</span></div>
          </div>
        </li>
        <li>
          <div class="t">
            <div class="profile">
              <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
              <div class="txt">
                <div><span class="name">海妖小马甲</span><small class="time">3小时前</small></div>
                <p>我是个马甲</p>
              </div>
            </div>
            <div class="fn">
              <span class="zan has"><small>56</small></span>
            </div>
          </div>
          <div class="c">
            <pre>前排支持前排支持前排支持前排支持前排  <span class="placeholder"></span></pre>
            <div class="slide"><small>2</small><span>收起</span></div>
          </div>
          <div class="list2">
            <ul>
              <li>
                <div class="t">
                  <div class="fn">
                    <span class="zan has"><small>12</small></span>
                  </div>
                  <div class="profile">
                    <div class="txt">
                      <div><span class="name2">名字22</span><b class="arrow"/><small class="time">昨天 18:08</small><span class="name">名字</span></div>
                      <p>签名签名签名签名签名签名</p>
                    </div>
                    <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                  </div>
                </div>
                <div class="c">
                  <pre>内容内容内容内容\n内容内容内容n内容内容内容n内容内容内容内容内容123</pre>
                </div>
              </li>
              <li>
                <div class="t">
                  <div class="fn">
                    <span class="zan has"><small>5</small></span>
                  </div>
                  <div class="profile">
                    <div class="txt">
                      <div><span class="name2">名字22</span><b class="arrow"/><small class="time">昨天 18:08</small><span class="name">名字</span></div>
                      <p>签名签名签名签名签名签名</p>
                    </div>
                    <img class="pic" src="http://tva3.sinaimg.cn/crop.0.0.328.328.50/6924ccf1gw1f889w9il5pj209709e0tx.jpg"/>
                  </div>
                </div>
                <div class="c">
                  <pre>哈哈哈</pre>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>;
  }
}

export default Comment;