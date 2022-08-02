api.map("K", "R");
api.map("J", "E");

function buildSearchEngineOptions(favicon_url) {
    return {favicon_url: favicon_url};
}

//删除默认icon
function removeDefaultIcon(alias) {
    if (!!alias) {
        localStorage.removeItem('surfingkeys.searchEngineIcon.' + alias);
    }
}

//添加搜索
function addSearch(alias, desc, search_url, search_leader_key = 's', suggestion_url, callback, only_site_key = 'o', options) {
    // removeDefaultIcon(alias);
    api.addSearchAlias(alias, desc, search_url, search_leader_key, suggestion_url, callback, only_site_key, options);
    api.mapkey('o' + alias, `打开${desc}搜索框`, function () {
        api.Front.openOmnibar({
            type: "SearchEngine",
            extra: alias
        });
    });
}

//知乎搜索
addSearch('z', '知乎', 'https://www.zhihu.com/search?type=content&q=', 's', 'https://www.zhihu.com/api/v4/search/suggest?q=', function (response) {
    var res = JSON.parse(response.text);
    return res.suggest.map(function (r) {
        return r.query;
    });
})

//豆瓣搜索
addSearch('d', '豆瓣电影', 'https://movie.douban.com/subject_search?search_text=', 's', 'https://movie.douban.com/j/subject_suggest?q=', function (response) {
    return parseDoubanSearchResult(response);
});
function parseDoubanSearchResult(response) {
    let res = [];
    if (response && response.text) {
        let list = JSON.parse(response.text);
        if (!!list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let img = list[i].pic || list[i].img || '';
                let year = list[i].year || '';
                let subtitle = list[i].author_name || list[i].sub_title || '';
                res.push({
                    html: `<li>
                                <div style="float: left">
                                    <img src="${img}" width="50" />
                                </div>
                                <div style="float: left; margin-left: 10px; padding-top: 3px;">
                                    <div style="font-size: 16px; color: #1a2a3a;">${list[i].title}</div>
                                    <div style="font-size: 12px; color: #3a4a5a; margin-top: 3px;">${subtitle}</div>
                                </div>
                                <div style="float: left; margin-left: 10px; padding-top: 10px; font-size: 12px; color: #3a4a5a;">${year}</div>
                           </li>`,
                    props: {
                        url: list[i].url
                    }
                });
            }
        }
    }
    return res;
}

//豆瓣图书搜索
addSearch('s', '豆瓣图书', 'https://book.douban.com/subject_search?search_text=', 's', 'https://book.douban.com/j/subject_suggest?q=', function (response) {
    return parseDoubanSearchResult(response);
});

//bilibili搜索
addSearch('l', 'bilibili', 'https://search.bilibili.com/all?keyword=', 's', 'https://s.search.bilibili.com/main/suggest?func=suggest&suggest_type=accurate&sub_type=tag' +
    '&main_ver=v1&highlight=&userid=2053595&bangumi_acc_num=1&special_acc_num=1&topic_acc_num=1&upuser_acc_num=3&tag_num=10&special_num=10' +
    '&bangumi_num=10&upuser_num=3&term=',
    function (response) {
        if (!!response && response.text) {
            let res = JSON.parse(response.text);
            let tags = res.result.tag || [];
            console.log(tags);
            return tags.map(e => {
                return e.value;
            });
        }
    });

//duckduckgo搜索
addSearch('f', 'duckduckgo', 'https://duckduckgo.com/?q=', 's', 'https://duckduckgo.com/ac/?q=', function (response) {
    var res = JSON.parse(response.text);
    return res.map(function (r) {
        return r.phrase;
    });
});

//google搜索
addSearch('g', 'google', 'https://duckduckgo.com/?q=!g ', 's', 'https://www.google.com/complete/search?client=chrome-omni&gs_ri=chrome-ext&oit=1&cp=1&pgcl=7&q=', function (response) {
    var res = JSON.parse(response.text);
    return res[1];
}, buildSearchEngineOptions("https://www.google.com"));

//grimdawn数据库搜索
addSearch('q', 'grimdawn', 'https://www.grimtools.com/db/zh/search?query=', 's')

//必应搜索
addSearch('w', 'bing', 'https://cn.bing.com/search?q=', 's', 'http://api.bing.com/osjson.aspx?query=', function (response) {
    var res = JSON.parse(response.text);
    return res[1];
});