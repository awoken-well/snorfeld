import {
    get
} from 'svelte/store'

export default function (fragments) {
    const flatten = flattenStore(fragments)

    function flattenStore(data) {
        return Object.values(data).map((f) => get(f))
    }

    function groupByDataKey(key) {
        let values = new Set(flatten.map((f) => {
            return f.parsed.data[key]
        }))
        let nested = []
        Array.from(values).sort().forEach((v) => {
            nested.push({
                key: v,
                values: flatten.filter((f) => f.parsed.data[key] === v).sort((a,b)=> ('' + a.slug).localeCompare(b.slug) )
            })
        })
        return nested
    }

    function groupByDataKeyValue(key, value) {
        let values = flatten.filter((f) => {
            return f.parsed.data[key] == value
        })
        return values
    }

    function getAllKeysForGroup(group) {
        let keys = new Set()
        group.forEach((f)=>{
            Object.keys(f.parsed.data).forEach((k)=>{keys.add(k)})
        })

        return Array.from(keys)
    }

    function newFragment(path) {
        let parsedPath = window.api.parsePath(path)

        let fragment = {
            id: path,
            slug: parsedPath.name,
            filename: parsedPath.base,
            path: path,
            raw: '\n',
            lastModified: 0,
            parsed: {
                data: {},
                content: '\n',
                isEmpty: false,
                excerpt: ''
            }
        }

        return fragment
    }


    function newFragmentForKeyValue(key, value) {
        // get first path
        let group = groupByDataKeyValue(key, value)
        let expath = group[0].path
        let folder = window.api.parsePath(expath).dir
        let path = window.api.joinPath([folder, 'untitled.md'])
        
        let fragment = newFragment(path)
        let keys = getAllKeysForGroup(group)
        keys.forEach((k)=>{fragment.parsed.data[k] = ''})

        fragment.parsed.data[key] = value
        return fragment
    }

    return {
        groupByDataKey,
        groupByDataKeyValue,
        newFragmentForKeyValue
    }
}