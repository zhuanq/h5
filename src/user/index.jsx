/**
 * Created by army8735 on 2017/12/4.
 */

'use strict';

import './user.html';
import './index.less';

import qs from 'anima-querystring';

import User from './User.jsx';

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let user = migi.preExist(
    <User/>,
    '#page'
  );
  jsBridge.setOptionMenu({
    icon1: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEUAAAAAAAAAAAAAAAD+/v4AAAD5+fnk5OTq6uoAAAAwMDAAAAAAAACAgID///8waL84AAAADnRSTlMABxEL8BqUoZ0nIiITDIsBZnQAAABpSURBVEjHYxgFgxYICuKXl01xu4hPnlHs3btEAXwKTN69c8anQFDl3TsnfK4Q1nj3rskQnwlaJe6L8CpQ3Tk7CJ8VjDahoYfx+kJYSclQAG9AChsKEgxqCgHjaGyOxuZobA7K2BwFNAMAj1k2xo1Ti1oAAAAASUVORK5CYII=',
  });
  user.init(id);
});
