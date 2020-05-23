
let express = require('express');
let app = express();
const got =require('got')
const path = require('path')

/**
 * Success Route
 */
app.get('/', function(req, res) {
  res.send('simple proxy');
});
/**
 * Download Route
 */
app.get('/*',function(req,res){
  /**
   * if your url is  domain.com/linux.cn/article-12241-1.html
   * the req.path is /linux.cn/article-12241-1.html
   * then, use substr to get default url -> linux.cn/article-12241-1.html
   * 
   * default http ?
   * 
   * yes, in most case, if a website only accept https conenction,
   * it will send a 301 response, so, http is ok for this case.(just in my test)
   * 
   */
  let url = `http://${req.path.substr(1)}`
  /**
   * get base for download filename
   */
  let filename = path.parse(url).base;
  
  got(url).then(result => {
    /**
     * set header to get repsonse as download file
     */
    res.set({
      'Content-Disposition': `attachment; filename=${filename}`
    })
    /**
     * send data;
     */
    res.end(result.rawBody)
  }).catch(error => {
    res.end("your url is error, maybe you can open an issue for me \r\nissue url: https://github.com/bestony/simple-proxy")
  })
});

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
