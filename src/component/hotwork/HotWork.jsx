/**
 * Created by army8735 on 2017/8/8.
 */

import util from '../../common/util';
import worksType from '../../works/worksType';

class HotWork extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
  @bind dataList
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="cp-hotwork" onClick={ { a: this.click } }>
      {
        this.dataList
          ? this.dataList.length
            ? <ul>
              {
                this.dataList.map(function(item) {
                  let url = `/works.html?worksId=${item.WorksID}`;
                  return <li>
                    <a href={ url } class="pic" title={ item.Title }>
                      <img src={ util.autoSsl(util.img172_172_80(item.cover_Pic)) || '/src/common/blank.png' }/>
                      <span class="type">{ worksType[item.WorkType] }</span>
                      <span class="num">{ util.abbrNum(item.Popular) }</span>
                    </a>
                    <a href={ url } class="txt" title={ item.Title }>
                      <span class="name">{ item.Title }</span>
                      <span class="author">{ (item.SingerName || []).join(' ') }</span>
                    </a>
                  </li>;
                })
              }
              {
                this.props.more
                  ? <li class="more">
                    <a href={ this.props.more } title="全部作品">查看更多</a>
                  </li>
                  : ''
              }
              </ul>
            : <div class="empty">暂无数据</div>
          : ''
      }
    </div>;
  }
}

export default HotWork;
