var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
   dynamicNavbar: true
});

myApp.onPageInit('index', function (page) {
   $$('#menu_strona_glowna').append('<li>DUPA</li>');
   $$('#menu_strona_glowna').append(getMenuItem('DUPA', 'dupa'));
   // var pr_home_page = community.curl.get('http://www.polskieradio.pl');
   // var pr_main_menu = pr_home_page.match(/<a href="(\/[^"]+)" class="list-item"[\s]*>[\s]*<div class="item-title">([^<]+)<\/div>/g);
   // $$('#debug').append(pr_main_menu);
}).trigger();

myApp.onPageInit('settings', function (page) {
   console.log('prdldebug 3');
});

function getMenuItem(label, url) {
   var html = '<li><a href="'+url+'" class="item-link">';
   html = html + '<div class="item-content">';
   html = html + '<div class="item-inner"><div class="item-title">'+label+'</div></div>';
   html = html + '</div></a></li>';
   return html;
}

