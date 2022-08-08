/**Database**/
import db from "../lib/database.js";

import { 
  snapsave, 
  groupWA, 
  tiktokdl,
  facebookdl,
  facebookdlv2,
  youtubedl,
  youtubedlv2,
  youtubedlv3
} from "@bochilteam/scraper";//🗿
import fetch from "node-fetch";


export async function before(m, { isAdmin, isBotAdmin, isPrems, isOwner }) {
  
  //
  let chat = db.data.chats[m.chat]
  let user = db.data.users[m.sender]
  let me = db.data.settings[this.user.jid]
  //
  let tau = m.text //biar gk ribet anjim
  
  if (chat.isBanned || user.banned || !me.autodl || m.isBaileys) return
  
  //TIKTOK DL
  if (/https?:\/\/(www\.|v(t|m)\.|t\.)?tiktok\.com/i.test(tau)) {
    var { author: { nickname }, video, description } = await tiktokdl(tau)
    var url = video.no_watermark || video.no_watermark2 || video.no_watermark_raw
    if (!url) throw 'Can\'t download video!'
    this.sendFile(m.chat, url, "",`*TIKTOK DOWNLOADER*\n
*Nickname:* ${nickname}
*Description:* ${description ? `${description}` : "None"}
`.trim(), m);
 };

  //Facebook
  if (/https?:\/\/(fb\.watch|(www\.|web\.|m\.)?facebook\.com)/i.test(tau)) {
    const { result } = await facebookdl(tau).catch(async _ => await facebookdlv2(tau))
    for (const { url, isVideo } of result.reverse()) this.sendFile(m.chat, url, `facebook.${!isVideo ? 'bin' : 'mp4'}`, `🔗 *Url:* ${url}`, m);
  };

  //Yt audio
  if (/https?:\/\/(youtu\.be)/i.test(tau)) {
    const { thumbnail, audio: _audio, title } = await youtubedl(tau).catch(async _ => await youtubedlv2(tau)).catch(async _ => await youtubedlv3(tau))
  const limitedSize = (isPrems || isOwner ? 99 : limit) * 1024
  let audio, source, res, link, lastError, isLimit
  for (let i in _audio) {
    try {
      audio = _audio[i]
      isLimit = limitedSize < audio.fileSize
      if (isLimit) continue
      link = await audio.download()
      if (link) res = await fetch(link)
      isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
      if (isLimit) continue
      if (res) source = await res.arrayBuffer()
      if (source instanceof ArrayBuffer) break
    } catch (e) {
      audio = link = source = null
      lastError = e
    };
  };
  if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) throw 'Error: ' + (lastError || 'Can\'t download audio')
   await this.sendFile(m.chat, thumbnail, 'thumbnail.jpg', `
*📌Title:* ${title}
*🗎 Filesize:* ${audio.fileSizeH}
*${isLimit ? 'Pakai ' : ''}Link:* ${link}
`.trim(), m)
  if (!isLimit) await this.sendFile(m.chat, source, title + '.mp3', `
*📌Title:* ${title}
*🗎 Filesize:* ${audio.fileSizeH}
`.trim(), m, null, {
    asDocument: true
  });
  };
};
