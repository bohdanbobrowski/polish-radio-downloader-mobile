var myApp = new Framework7();
var $$ = Dom7;
var PR = 'http://www.polskieradio.pl';
var mainView = myApp.addView('.view-main', {
   dynamicNavbar: true
});

var categories = [];
var prdl_id = 0;

myApp.onPageInit('index', function (page) {   
   $$.ajax({
      url: PR,
      success: function(www) {
         parser = new DOMParser();
         www_dom = parser.parseFromString(www, "text/html");
         var fc_dom = www_dom.getElementsByClassName('footer-column');
         $$.each(fc_dom, function(index, fc){
            var fc_html = fc.innerHTML;
            var cat_regex = /<a href="(\/[0-9]+[^"]+)"[\s]*class="category uppercase"[\s]*>[\s]*([^<]+)/g;
            var category = cat_regex.exec(fc_html);
            if(category != null){
               prdl_id = prdl_id + 1;
               categories[prdl_id] = {
                  id: prdl_id,
                  url: category[1],
                  title: category[2],
                  pages: []
               };
               var regex = /<a href="(\/[0-9]+[^"]+)"[\s]*class="link"[\s]*>[\s]*([^<]+)/g;
               var item = regex.exec(fc_html);
               var iid = 1;
               while (item != null) {
                  categories[prdl_id].pages.push({
                     url: item[1],
                     title: item[2],
                  });                  
                  item = regex.exec(fc_html);
                  iid = iid+1;
               } 
               $$('#menu_strona_glowna').append(getPageLink(categories[prdl_id], prdl_id));
            }
         });         
         $$('#menu_strona_glowna a.prdl_page').on('click', function (e) {           
            var p_id = $$(this).attr('data-prdl-id');
            mainView.router.loadContent(getDynamicPageContent(categories[p_id]));
            $$('#nav_back_button').css('opacity',1);
            $$('#menu_podstrony_'+p_id+' a').on('click', function (e) {          
               var id = $$(this).attr('data-prdl-id');
               readAllPages(categories[p_id].pages[id]);
            });
         });
      }
   });
}).trigger();

myApp.onPageAfterAnimation('index', function (page) {
   $$('#nav_back_button').css('opacity',0);
});

function readAllPages(page) {   
   page.id = guid();
   page.pages = [];
   page.media = [];
   page.media_ids = [];
   if(page.url.search('http://') === -1) {
      page.url = PR + page.url;
   }
   console.log(page.url);
   $$.ajax({
      url: page.url,
      success: function(page_html) {
         var regex = /<article class="[^"]*">[\s]+<a href="([^"]+)"[ a-zA-Z-=\"]* title="([^"]+)"/g;
         var item = regex.exec(page_html);
         while (item != null) {
            page.pages.push({
               url: item[1],
               title: item[2],
            });
            item = regex.exec(page_html);
         }
         var media_regex = /data-media=({[^}]+})/g;
         var media = media_regex.exec(page_html);
         while (media != null) {
            md = JSON.parse(media[1].replace(/\\"/g,'"'));
            if(md.id !== undefined && page.media_ids.indexOf(md.id) === -1) {
               page.media.push(md);
            }
            page.media_ids.push(md.id);
            media = media_regex.exec(page_html);            
         }
         mainView.router.loadContent(getDynamicPageContent(page));
         $$('#menu_podstrony_'+page.id+' a.prdl_media').on('click', function (e) {
            var media = $$(this).attr('data-prdl-media');
            media = JSON.parse(media.replace(/\#\%\#/g,'"'));            
            var file_url = media.file;
            if(file_url.search('http://') === -1) {
               file_url = 'http:' + file_url;
            }
            var title = urldecode(media.title);
            title = title.replace('.mp3','');
            title = title.replace('_',' ');
            var file_name = title;
            if(file_name.search('.mp3') === -1) {
               file_name = file_name + '.mp3';
            }
            var fileTransfer = new FileTransfer();
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
            function onError(e) {
               alert("Wystąpił błąd");
            };
            function onFileSystemSuccess(fileSystem) {
               var entry = "";
               entry = fileSystem;
               entry.getDirectory('PolskieRadioDownloader', {
                  create: true,
                  exclusive: false
               }, onGetDirectorySuccess, onError);
            };
            function onGetDirectorySuccess(dir) {
               cdr = dir;
               dir.getFile(file_name, {
                  create: true,
                  exclusive: false
               }, gotFileEntry, onError);
            };
            function gotFileEntry(fileEntry) {
               var uri = encodeURI(file_url);
               fileTransfer.download(
                  uri,
                  cdr.nativeURL + file_name,
                  function(entry) {
                     alert('Zakończono pobieranie: '+file_name);
                  }
               );
            };
         });
         $$('#menu_podstrony_'+page.id+' a.prdl_page').on('click', function (e) {
            var id = $$(this).attr('data-prdl-id');
            readAllPages(page.pages[id]);
         })
      }
   });
}

function getPageLink(item, id) {
   var html = '<li><a href="#" class="item-link prdl_page" data-prdl-title="'+item.title+'" data-prdl-link="'+item.url+'" data-prdl-id="'+id+'">';
   html = html + '<div class="item-content">';
   html = html + '<div class="item-inner"><div class="item-title">'+item.title+'</div></div>';
   html = html + '</div></a></li>';
   return html;
}

function getMediaLink(media) {  
   var title = urldecode(media.title);
   title = title.replace('.mp3','');
   title = title.replace('_',' ');
   title = title.substring(45, length);
   var html = '<li><a href="#" class="item-link prdl_media" data-prdl-media="'+JSON.stringify(media).replace(/"/g,'#%#')+'" data-prdl-id="'+media.uid+'">';
   html = html + '<div class="item-content"><div class="item-media"><i class="f7-icons">volume</i></div>';
   html = html + '<div class="item-inner"><div class="item-title">'+title+'</div></div>';
   html = html + '</div></a></li>';
   return html;
}

function getDynamicPageContent(category, category_id=null) {
   if(category_id === null) {
      category_id = category.id;
   }
   var html = '<div class="pages navbar-fixed toolbar-fixed"><div class="page" data-page="podstrona-'+category_id+'">';
   html = html + '<div class="page-content">';
   html = html + '<div class="content-block-title">'+category.title+'</div>';
   html = html + '<div class="list-block">';
   html = html + '<ul id="menu_podstrony_'+category.id+'">';
   if(category.media !== undefined) {
      $$.each(category.media, function(index, media){
         console.log(media);
         if(media !== undefined) {
            html = html + getMediaLink(media);
         }
      });
   }
   if(category.pages !== undefined) {
      $$.each(category.pages, function(index, item){
         html = html + getPageLink(item, index);
      });
   }
   html = html + '</ul>';
   html = html + '</div>';
   html = html + '</div>';
   html = html + '</div></div>';
   return html;
}

function guid() {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
   }
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function urldecode(url) {
   return decodeURIComponent(url.replace(/\+/g, ' '));
}
