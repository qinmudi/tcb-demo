/**
 * Copyright (c) 2020 Tencent, All rights reseved.
 * @fileOverview abc入口
 * @author rocket-cli
 * @version 1.0.0
 * @since 2020-04-25
 * @description
 *  1) 此文件为abc页面入口文件
 */
const serverless = require('serverless-http')
const Koa = require('koa') // or any supported framework
const { get } = require('lodash')

const app = new Koa()
const router = require('koa-router')()
const logger = require('koa-logger')
const view = require('koa-view')
const mount = require('koa-mount')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const jsonp = require('koa-jsonp')

const tcb = require('tcb-admin-node')

const api = require('./server')

const isLocal = process.env.NODE_ENV
const port = 3001
let prefix = 'abc'
const env = 'test-2f414c'

const cloudConfig = { env }

if (isLocal === 'local') {
    prefix = ''
    cloudConfig['secretId'] = 'xxx'
    cloudConfig['secretKey'] = 'xxx'
}

tcb.init(cloudConfig)

const db = tcb.database()
const _ = db.command

router.post('/test', async (ctx) => {
    const data = await api.test()
    ctx.body = {
        ...ctx.request.body,
        ...data
    }
  }
)

router.get('/cache', async (ctx) => {
    const data = await api.getCache(db)
    ctx.body = data
})

router.get('/', async (ctx) => {
    ctx.state = {
        session: ctx.session,
        title: 'app',
        prefix
    }

    await ctx.render('index', {
        env
    })
})

app.use(logger())
app.use(view(__dirname + '/views'))
app.use(static(__dirname + '/static'))
app.use(bodyparser())
app.use(router.routes())

app.use(async ctx => {
  ctx.body = 'Hello TCB'
})

if (isLocal === 'local') {
    app.listen(port)
    console.log('服务已经启动, http://localhost:'+port)
}

module.exports.main = serverless(app)
