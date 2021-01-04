const Router = require('./router')
const sanitizeHtml = require('sanitize-html')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handlerSanitize(request) {
    const formData = await request.json()
    const init = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'content-type': 'application/json',
        },
    }
    const body = JSON.stringify({
        text: formData.text,
        clean: sanitizeHtml(formData.text),
    })
    return new Response(body, init)
}

async function handlerMap(request) {
    let html = `<h1><a href='/about'>Map here</a></h1>`
    const body = JSON.stringify({ html: html })
    const init = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
        },
    }
    return new Response(body, init)
}

async function handlerMailchimp(request) {
    const name = new URL(request.url).searchParams.get('name')
    return await fetch(`${UTIL_API_ENDPOINT}/mailchimp/list?name=${name}`)
}

async function handleRequest(request) {
    const r = new Router()

    r.options(
        '.*/*',
        () =>
            new Response('', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            })
    )
    r.post('/sanitize', request => handlerSanitize(request))
    r.get('/map', request => handlerMap(request))
    r.get('/mailchimp', request => handlerMailchimp(request))

    const resp = await r.route(request)
    return resp
}
