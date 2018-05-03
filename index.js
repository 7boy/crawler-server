var Crawler = require("crawler");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://112.74.60.110:27017/fablab";

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err)
    throw err;
  }
  console.log("数据库已创建!");
  db.close();
});
return
var c = new Crawler({
  rateLimit: 3000,
  // maxConnections : 10000,
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error){
      console.log(error);
    }else{
      var $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log($("title").text());
    }
    done();
  }
});
let arr = []
for(let i = 80300;i < 80377; i++){
  arr.push(`http://www.pian3.com/vod-detail-id-${i}.html`)
}
c.queue(arr);