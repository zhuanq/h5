/**
 * Created by army8735 on 2017/12/31.
 */

'use strict';

import './phone.html';
import './index.less';

import Phone from './Phone.jsx';

jsBridge.ready(function() {
  jsBridge.refreshState(false);

  let phone = migi.preExist(
    <Phone/>,
    '#page'
  );
});
