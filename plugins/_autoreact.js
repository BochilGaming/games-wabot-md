import { fs } from 'fs'

let handler = async (m, { text, conn }) => {
    if (m.chat.endsWith('@c.us')) return  //@g.us //broadcast
    //let { isBanned } = db.data.chats[m.chat]
    //let { banned } = db.data.users[m.sender]
    //let { group } = db.data.settings[this.user.jid]

    if (/^(hmmm|hmm)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `😈`, key: m.key,}})
       }
    if (/^(love u|i love you|lub u|i love u)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `❤️`, key: m.key,}})
       }
    if (/^(fuck|fuck u|fuck you|cum)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `🖕`, key: m.key,}})
       }
    if (/^(sad|sed|sedd|sed aki|sedd aki)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `😢`, key: m.key,}})
       }
    if (/^(myre|myr|mire)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `🥴`, key: m.key,}})
       }
     if (/^(Entha myre)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `🤷‍♂️`, key: m.key,}})
       }
       if (/^(haha)$/i.test(m.text)) {
        conn.sendMessage(m.chat, {
            react: {text: `😂`, key: m.key,}})
       }
  
  
}


export default handler
