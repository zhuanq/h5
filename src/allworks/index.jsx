/**
 * Created by army8735 on 2017/12/9.
 */

'use strict';

import './allworks.html';
import './index.less';

import net from '../common/net';
import util from '../common/util';
import AllWorks from './AllWorks.jsx';

jsBridge.ready(function() {
  let allWorks = migi.preExist(
    <AllWorks/>,
    '#page'
  );
});
