const {
    contextBridge,
    ipcRenderer
} = require("electron")

const path = require('path')

const settings = require('./store.js')

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
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        getProjectHistory: () => {
            return settings.getProjectHistory()
        },
        parsePath: (url) => {
            return path.parse(url)
        },
        joinPath: (parts) => {
            return path.join(...parts)
        }
    }
);