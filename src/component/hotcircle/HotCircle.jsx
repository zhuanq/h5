/**
 * Created by army8735 on 2017/11/12.
 */

'use strict';

import util from '../../common/util';

class HotCircle extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
  @bind dataList
  click(e, vd, tvd) {
    e.preventDefault();
    let href = tvd.props.href;
    let title = tvd.props.title + '圈';
    jsBridge.pushWindow(href, {
      title,
    });
  }
  render() {
    return <div class="cp-hotcircle" onClick={ { a: this.click } }>
      {
        this.dataList && this.dataList.length
          ? <ul>
            {
              this.dataList.map(function(item) {
                let url = `/circle.html?circleID=${item.TagID}`;
                return <li>
                  <a href={url} class="pic" title={item.TagName}>
                    <img src={util.autoSsl(util.img288_288_80(item.TagCover)) || '//zhuanquan.xin/img/blank.png'}/>
                  </a>
                  <a href={url} class="txt" title={item.TagName}>
                    <span class="name">{item.TagName}</span>
                    <span class="fans">成员 {util.abbrNum(item.FansNumber)}</span>
                    <span class="comment">画圈 {util.abbrNum(item.Popular)}</span>
                  </a>
                </li>;
              })
            }
          </ul>
          : <div class="empty">暂无数据</div>
      }
    </div>;
  }
}

export default HotCircle;