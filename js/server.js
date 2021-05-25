const   http    = require('http'),
        fs      = require('fs'),
        url     = require('url'),
        path    = require('path');       

http.createServer((request,response) =>{
    let addr = request.url;
        addr_parse = url.parse(addr, true);
        __dirname = path.resolve();
        file_path = path.join(__dirname, '../');
        

        fs.appendFile('../log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) =>{
            if (err){
                console.log(err);
            }else{
                console.log('Added to Log');
            }
        });
       
        if (addr_parse.pathname.includes('documentation')){           
            file_path = (file_path + '/documentation.html');
        }else{
            file_path = file_path + '/index.html';
        }
       
        fs.readFile(file_path, (err, data) =>{
            if (err){
                throw err;
            }

            response.writeHead(200, {'Content-Type' : 'text/plain'});
            response.end(data);
            response.end();
        });
    
}).listen(8080);

console.log('My first Node test server is running on Port 8080');