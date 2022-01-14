    // application settings stored in the store
    const Store = require('electron-store')
    const store = new Store()

    function getLastProject() {
        return store.get('lastProjectFolder')
    }
    
    function setLastProject(path) {
        store.set('lastProjectFolder', path)
        console.log('SET LAST PROJECT: ', path, getLastProject())

        let history = new Set(getProjectHistory())
        history.add(path)
        store.set('projectHistory', Array.from(history))
    }

    function getProjectHistory() {
        let history = store.get('projectHistory')
        return !history? [] : history
    }

    module.exports = {
        getLastProject,
        setLastProject,
        getProjectHistory
    }
