/**
 * Created by army on 2017/6/8.
 */

import './works.html';
import './index.less';

import qs from 'anima-querystring';

import Media from './Media.jsx';
import WorkType from '../component/work/WorkType.jsx';
import Video from './Video.jsx';
import Audio from './Audio.jsx';
import Image from './Image.jsx';
import Link from './Link.jsx';
import Intro from './Intro.jsx';
import PlayList from './PlayList.jsx';
import WorkComment from './WorkComment.jsx';
import ImageView from './ImageView.jsx';
import itemTemplate from "./itemTemplate";

let search = qs.parse(location.search.replace(/^\?/, ''));
let id = search.id;

jsBridge.ready(function() {
  let media = migi.render(
    <Media/>,
    document.body
  );

  // let medias = migi.render(
  //   <div class="medias">
  //     <div class="c"/>
  //   </div>,
  //   document.body
  // );
  // let mediasC = medias.find('.c');
  // let $mediasC = $(mediasC.element);
  // let video, audio, image, link;
  // let mediasList = [];
  // let mediaSwitch = medias.find(MediaSwitch);
  // mediaSwitch.on('change', function(i) {
  //   let x = i * winWidth;
  //   $mediasC.css('-webkit-transform', `translate3d(${-x}px,0,0)`);
  //   $mediasC.css('transform', `translate3d(${-x}px,0,0)`);
  //   mediasList[i].show();
  // });
  // let medias = migi.render(
  //   <div class="medias">
  //     <div class="c">
  //       <Video/>
  //       <Audio/>
  //       <Image images={ images }/>
  //       <Link/>
  //     </div>
  //     <MediaSwitch/>
  //   </div>,
  //   document.body
  // );
  // let $mediasC = $(medias.element).children('.c');
  // let video = medias.find(Video);
  // video.on('playing', function() {
  //   menu.hide();
  // });
  // video.on('pause', function() {
  // });
  // let audio = medias.find(Audio);
  // let image = medias.find(Image);
  // let mediaSwitch = medias.find(MediaSwitch);
  // mediaSwitch.on('change', function(i) {
  //   let x = i * winWidth;
  //   $mediasC.css('-webkit-transform', `translate3d(${-x}px,0,0)`);
  //   $mediasC.css('transform', `translate3d(${-x}px,0,0)`);
  // });
  // // mediaSwitch.emit('change', 3);
  // let imageView = migi.render(
  //   <ImageView images={ images }/>,
  //   document.body
  // );
  // image.on('show', function(i) {
  //   imageView.show(i);
  // });

  let intro = migi.render(
    <Intro/>,
    document.body
  );
  let workComment = migi.render(
    <WorkComment workId={ id }/>,
    document.body
  );
  media.on('tagChange', function(i) {
    intro && intro.hide();
    workComment && workComment.hide();
    switch (i) {
      case '0':
        intro.show();
        break;
      case '1':
        workComment.show();
        break;
    }
  });
  // media.emit('tagChange', '1');

  if(id) {
    util.postJSON('api/works/GetWorkDetails', { WorksID: id }, function(res) {
      if(res.success) {
        let data = res.data;

        jsBridge.setTitle(data.Title);
        jsBridge.setSubTitle(data.sub_Title || '小标题');

        media.setCover(data.cover_Pic);
        media.setWorks(data.Works_Items);
        media.popular = data.Popular;

        intro.tags = data.ReturnTagData || [];

        return;

        let workHash = {};
        let workList = [];

        data.Works_Items.forEach(function(item) {
          // 先按每个小作品类型排序其作者
          util.sort(item.Works_Item_Author, itemTemplate(item.ItemType).authorSort || function() {});
          // 将每个小作品根据小类型映射到大类型上，再归类
          let bigType = itemTemplate(item.ItemType).bigType;
          workHash[bigType] = workHash[bigType] || [];
          workHash[bigType].push(item);
        });

        Object.keys(workHash).forEach(function(k) {
          workList.push({
            bigType: k,
            value: workHash[k],
          });
        });
        util.sort(workList, function(a, b) {
          let aw = WorkType.Weight[a.bigType] || 0;
          let bw = WorkType.Weight[b.bigType] || 0;
          return aw < bw;
        });

        let count = 0;
        let authorList = [];
        workList.forEach(function(works) {
          let authors = [];
          works.value.forEach(function(work) {
            authors = authors.concat(work.Works_Item_Author);
          });
          // 去重
          let hash = {};
          for(let i = 0; i < authors.length; i++) {
            let author = authors[i];
            let key = author.ID + ',' + author.WorksAuthorType;
            if(hash[key]) {
              authors.splice(i--, 1);
              continue;
            }
            else {
              hash[key] = true;
            }
          }
          // 合并
          hash = {};
          let nAuthors = [];
          authors.forEach(function(author) {
            if(hash.hasOwnProperty(author.WorksAuthorType)) {
              nAuthors[hash[author.WorksAuthorType]].list.push(author);
            }
            else {
              hash[author.WorksAuthorType] = nAuthors.length;
              nAuthors.push({
                type: author.WorksAuthorType,
                list: [author]
              });
            }
          });
          authorList.push(nAuthors);
          // 按顺序放置媒体类型
          if(works.bigType == WorkType.Type.AUDIO) {
            let audioList = works.value.map(function(work) {
              return work.FileUrl;
            });
            audio = migi.render(
              <Audio data={ audioList }/>,
              mediasC.element
            );
            mediasList.push(audio);
            count++;
          }
          else if(works.bigType == WorkType.Type.VIDEO) {
            let videoList = works.value.map(function(work) {
              return work.FileUrl;
            });
            video = migi.render(
              <Video data={ videoList }/>,
              mediasC.element
            );
            mediasList.push(video);
            count++;
          }
        });

        // authors.setAuthor(authorList);
        authors.setAuthor(authorList);
        media.ref.authors.setAuthor(authorList);

        count = Math.max(1, count);
        $mediasC.css('width', count * 100 + '%');

        intro.tags = data.ReturnTagData || [];

        // return;
        //
        // let authorsList = [];
        // let linksList = [];
        //
        // function addAuthor(type, data) {
        //   if (data && data.length) {
        //     let arr = {
        //       type,
        //       list: []
        //     };
        //     data.forEach(function (author) {
        //       arr.list.push({
        //         id: author.ID,
        //         name: author.AuthName,
        //         img: author.HeadUrl,
        //       });
        //     });
        //     authorsList.push(arr);
        //   }
        // }
        //
        // if (data.Works_Music && data.Works_Music.length) {
        //   data.Works_Music.forEach(function (item) {
        //     addAuthor('歌手', item.Works_Music_Siger);
        //     addAuthor('作词', item.Works_Music_Lyricist);
        //     addAuthor('策划', item.Works_Music_Arrange);
        //     addAuthor('混音', item.Works_Music_Mixer);
        //     addAuthor('压缩', item.Works_Music_Composer);
        //
        //     if(item._5SingUrl) {
        //       linksList.push({
        //         type: '5sing',
        //         url: item._5SingUrl
        //       });
        //     }
        //   });
        //
        //   audio = migi.render(
        //     <Audio data={ data.Works_Music }/>,
        //     mediasC.element
        //   );
        //   if(count++ == 0) {
        //     audio.show();
        //   }
        //   mediasList.push(audio);
        // }
        //
        // if (authorsList.length) {
        //   authors.setAuthor(authorsList);
        // }
        // if(linksList.length) {
        //   link = migi.render(
        //     <Link data={ linksList }/>,
        //     mediasC.element
        //   );
        //   if(count++ == 0) {
        //     link.show();
        //   }
        //   mediasList.push(link);
        // }
        //
        // let width = Math.max(1, count);
        // $mediasC.css('width', width * 100 + '%');
        // mediaSwitch.init(mediasList);
        //
        // intro.tags = data.Tags || [];
      }
    });
  }
});
