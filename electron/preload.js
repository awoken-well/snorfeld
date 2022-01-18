const {
    contextBridge,
    ipcRenderer
} = require("electron")

const path = require('path')

const settings = require('./store.js')

const apiKeys = require('../keys.json')
const NLPCloudClient = require('nlpcloud')
const headlineClient = new NLPCloudClient('t5-base-en-generate-headline', apiKeys.nlpcloud)
const summaryClient = new NLPCloudClient('bart-large-cnn', apiKeys.nlpcloud)

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

async function summarizeRaw(raw) {
    const apiMaxTokens = 600
    let rawTokens = raw.split('.').reduce((acc, cur)=> acc + cur.split(' ').length, 0)
    let tokenLimit = Math.floor(rawTokens / (Math.floor(rawTokens/apiMaxTokens) + 1))
    console.log('Local token limit:', rawTokens, tokenLimit)

    let buffer = []
    let bufferCount = 0
    let summary = ''

    lines = raw.split('.')
    for (let idx in lines) {
        let line = lines[idx]
        let newTokens = line.split(' ').length

        buffer.push(line)
        bufferCount += newTokens

        if (bufferCount > tokenLimit || idx == lines.length-1) {
            let part = buffer.join('.')
            console.log('part:' , part)
            let startTime = new Date().getTime()
            let partSummary = await summaryClient.summarization(part).catch(err => {console.log(err)})  
            summary = [summary, partSummary.data.summary_text].join(' ')
            await sleep(20000 - (new Date().getTime() - startTime))

            console.log('part summary: ', partSummary.data.summary_text)
            buffer = []
            bufferCount = 0
        }
    }
    console.log('final summary:' ,summary)
    return summary
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = [
                'watch:start',
                'file:write',
                'file:writedata',
                'file:rename',
                'file:delete',
                'parser:parse','parser:string',
                'project:openlast',
                'settings:projecthistory'];
            if (validChannels.includes(channel)) {
                console.log('send:', channel)
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                'watch:added','watch:removed','watch:updated',
                'parser:parsed','parser:strung',
                'project:opened','project:closed'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                console.log('receive:', channel)
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        getProjectHistory: () => {
            return settings.getProjectHistory().map((p)=> {
                return {
                    dir: p.split(path.sep).pop(),
                    path: p
                }
            })
        },
        parsePath: (url) => {
            return path.parse(url)
        },
        joinPath: (parts) => {
            return path.join(...parts)
        },
        headline: async (raw) => {
            raw = raw.replace(/[_*'"]+/g,'').trim()
            console.log(raw, raw.split(' ').length)

            let headline = await headlineClient.summarization(raw).catch(err => {console.log(err)})
            return headline.data.summary_text
        },
        summarize: async (raw) => {
            const max_length = 100
            let rawTokens = raw.split(' ').length
            while (rawTokens > max_length) {
                raw = await summarizeRaw(raw)
                rawTokens = raw.split(' ').length
            }

            return raw
        }
    }
);