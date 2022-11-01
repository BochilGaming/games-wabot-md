process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import './config.js'
import Connection from './lib/connection.js'
import Helper from './lib/helper.js'
import db from './lib/database.js'
import clearTmp from './lib/clearTmp.js';
import {
  spawn
} from 'child_process'
import {
  protoType,
  serialize
} from './lib/simple.js'
import {
  plugins,
  loadPluginFiles,
  reload,
  pluginFolder,
  pluginFilter
} from './lib/plugins.js'

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

// Assign all the value in the Helper to global
Object.assign(global, {
  ...Helper,
  timestamp: {
    start: Date.now()
  }
})

// global.opts['db'] = process.env['db']

/** @type {import('./lib/connection.js').Socket} */
const conn = Object.defineProperty(Connection, 'conn', {
  value: await Connection.conn,
  enumerable: true,
  configurable: true,
  writable: true
}).conn

// load plugins
loadPluginFiles(pluginFolder, pluginFilter, {
  logger: conn.logger,
  recursiveRead: false
}).then(_ => console.log(Object.keys(plugins)))
  .catch(console.error)


if (!opts['test']) {
  setInterval(async () => {
    await Promise.allSettled([
      db.data ? db.write() : Promise.reject('db.data is null'),
      (opts['autocleartmp'] || opts['cleartmp']) ? clearTmp() : Promise.resolve()
    ])
    Connection.store.writeToFile(Connection.storeFile)
  }, 60 * 1000)
}
if (opts['server']) (await import('./server.js')).default(conn, PORT)


// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) (conn?.logger || console).warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) (conn?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) (conn?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => (conn?.logger?.info || console.log)('Quick Test Done'))
  .catch(console.error)
