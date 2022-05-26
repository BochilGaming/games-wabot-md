let handler =  m => m.reply(`
╭─「 Donasi • Pulsa 」
│ • Indosat Ooredoo [085752423288]
│ • Axis [083181913421]
╰────

╭─「 Donasi • Non Pulsa 」
│ • Dana/Shopeepay [085752423288]
│ • A/N Sadera
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

export default handler
