const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data')
const { spawn } = require('child_process')
const { MessageType } = require('@adiwajshing/baileys')

let handler  = async (m, { conn, text }) => {
/*let user = global.DATABASE._data.users[m.sender]
if (user.prems) {*/
	  await m.reply('Sedang Membuat...')
  if (text) {
    let res = await fetch('http://lolhuman.herokuapp.com/api/ttp4?apikey=761e676c13e7710a48011b2b&text=' + encodeURIComponent(text))
    let img = await res.buffer()
    if (!img) throw img
    let stiker = await sticker(img)
    conn.sendMessage(m.chat, stiker, MessageType.sticker, {
      quoted: m
    })
  }
//   } else if (!user.prems) m.reply('*FITUR INI KHUSUS UNTUK USER PREMIUM!*')
}

handler.command = /^(ttp2)$/i
handler.owner = false
handler.mods = false
handler.premium = true
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

//  MUHAMMAD AFDHAN

module.exports = handler

let tmp = path.join(__dirname, '../tmp')
function sticker(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        let res = await fetch(url)
        img = await res.buffer()
      }
      let inp = path.join(tmp, +new Date + '.jpeg')
      let png = path.join(tmp, +new Date + '.png')
      let out = path.join(tmp, +new Date + '.webp')
      fs.writeFileSync(inp, img)
      spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        png
      ])
      .on('error', reject)
      .on('close', () => {
        fs.unlinkSync(inp)
        spawn('convert', [png, out])
        .on('error', reject)
        .on('close', () => {
          fs.unlinkSync(png)
          resolve(fs.readFileSync(out))
          fs.unlinkSync(out)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}
// MUHAMMAD AFDHAN
