//Node.js中加载模块，使用require()语法。
const fs = require("fs")
const url = require("url")
const http = require("http")
var port = process.argv[2]

if (!port) {
    console.log("请指定端口号。")
    process.exit(1)
}

//使用http模块创建服务器

//例：http://localhost:8888/index.html?id=3
var server = http.createServer((request, response) => {
    //获取请求方法
    let method = request.method
    //将URL解构成对象，该对象的属性有:
    // 'protocol': null
    // 'slashes': null
    // 'auth': null    
    // 'host': null
    // 'port': null    
    // 'hostname': null
    // 'hash': null  
    // 'search': ?id=3
    // 'query':  id=3  
    // 'pathname': /index.html
    // 'path': /index.html?id=3
    // 'href': /index.html?id=3
    var parsedUrl = url.parse(request.url, false)
    //使用解构赋值将对象中的【某个属性对应的值】赋给名字为该属性的变量
    //等效于: let host = parsedUrl.host, 以此类推
    let { host, search, pathname, query } = parsedUrl
    //获取含GET字符串的链接 /index.html?id=3
    var pathWithQuery = request.url
    //获取链接中查询字符串外的路由
    let filename = pathname
    //用户直接访问根目录时返回首页
    filename = filename === "/" ? "/index.html" : filename
    //获取文件的后缀名（不含. 含点把+1删除）
    let filetype = filename.slice(filename.lastIndexOf(".") + 1)
    //根据哈希表确定返回文件的类型
    const fileTypeToReturn = {
        "html": "text/html",
        "css": "text/css",
        "js": "text/javascript",
        "jpg": "image/jpg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "json": "text/json",
        "xml": "text/xml"
    }
    let content
    response.setHeader("Content-Type", `${fileTypeToReturn[filetype] || "text/html"};charset=utf-8`)
    try {
        response.statusCode === 200
        content = fs.readFileSync(`public${filename}`)
    } catch {
        response.statusCode === 404
        response.setHeader("Content-Type", "text/html;charset=utf-8")
        content = "找不到对应的文件"
    }
    response.write(content)
    response.end()

})

server.listen(port)
console.log("正在监听: localhost:" + port)