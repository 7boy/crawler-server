let Crawler = require("crawler");
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://112.74.60.110:27017/fablab";

let dbo
MongoClient.connect(url, function (err, db) {
  if (err) {
    throw err;
  }
  dbo = db.db("movies").collection("movie");
})


let c = new Crawler({
  rateLimit: 200,
  // maxConnections : 10000,
  callback: function (error, res, done) {
    let $ = res.$;
    // 类型
    let type = $('td').eq(7).text().split('：')[1]
    let status = ($('title').text()) === '系统提示'
    if (!(status || type === '福利片')) {
      //id
      let id = res.options.uri.replace(/[^0-9]/ig, '')
      // 图片
      let pic = 'http://www.imeizy.com' + $('.img img').attr('src')
      // 标题
      let title = $('td').eq(3).text().split('：')[1]
      // 主演
      let protagonist = $('td').eq(4).text().split('：')[1]
      // 导演
      let director = $('td').eq(5).text().split('：')[1]
      // 地区
      let region = $('td').eq(8).text().split('：')[1]
      // 更新时间
      // let uploadTime = $('td').eq(9).text().split('：')[1]
      // 概要
      let intro = $('.intro').text()
      // 播放链接
      let links = []
      let len = $('li').length
      for (let i = 0; i < len; i++) {
        let info = $('li').eq(i).text()
        if (info.indexOf('.m3u8') !== -1) {
          links.push({
            type: info.split('$')[0],
            url: info.split('$')[1],
          })
        }
      }
      let data = {
        _id: id,
        pic,
        title,
        type,
        protagonist,
        director,
        region,
        intro,
        links,
        createTime: new Date().getTime()
      };

      //
      dbo.insertOne(data, function (err, res) {
        if (err) {
          console.log(err)
          throw err;
        }
        console.log("文档插入成功");
      });
    }
    done()
  }
});


let arr = []
for (let i = 1; i < 15000; i++) {
  arr.push(`https://www.imeizy.com/?m=vod-detail-id-${i}.html`)
}
c.queue(arr)





