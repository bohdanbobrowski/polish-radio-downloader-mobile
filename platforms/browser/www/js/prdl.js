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
                  items: []
               };
               var regex = /<a href="(\/[0-9]+[^"]+)"[\s]*class="link"[\s]*>[\s]*([^<]+)/g;
               var item = regex.exec(fc_html);
               var iid = 1;
               while (item != null) {
                  categories[prdl_id].items.push({
                     url: item[1],
                     title: item[2],
                  });                  
                  item = regex.exec(fc_html);
                  iid = iid+1;
               } 
               $$('#menu_strona_glowna').append(getMenuItem(categories[prdl_id], prdl_id));
            }
         });         
         $$('#menu_strona_glowna a').on('click', function (e) {           
            var p_id = $$(this).attr('data-prdl-id');
            mainView.router.loadContent(getDynamicPageContent(categories[p_id]));
            $$('#nav_back_button').css('opacity',1);
            $$('#menu_podstrony_'+p_id+' a').on('click', function (e) {          
               var id = $$(this).attr('data-prdl-id');
               console.log(id);
               console.log(categories[p_id].items);
               mainView.router.loadContent(getDynamicPageContent(categories[p_id].items[id], p_id+'_'+id));
            });
         });
      }
   });
}).trigger();

myApp.onPageAfterAnimation('index', function (page) {
   $$('#nav_back_button').css('opacity',0);
});

function getMenuItem(item, id) {
   var html = '<li><a href="#" class="item-link" data-prdl-title="'+item.title+'" data-prdl-link="'+item.url+'" data-prdl-id="'+id+'">';
   html = html + '<div class="item-content">';
   html = html + '<div class="item-inner"><div class="item-title">'+item.title+'</div></div>';
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
   if(category.items !== undefined) {
      $$.each(category.items, function(index, item){
         html = html + getMenuItem(item, index);
      });
   }
   html = html + '</ul>';
   html = html + '</div>';
   html = html + '</div>';
   html = html + '</div></div>';
   return html;
}

