const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync('./localhost-cert.key'),
    cert: fs.readFileSync('./localhost-cert.crt')
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === '/a') {
            app.render(req, res, '/b', query)
        } else if (pathname === '/b') {
            app.render(req, res, '/a', query)
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(5555, err => {
        if (err) throw err
        console.log('> Ready on https://localhost:5555')
    })
})