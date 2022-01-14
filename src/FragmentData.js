import { get } from 'svelte/store'

export default function(fragments) {
    const flatten = flattenStore(fragments)

    function flattenStore(data){
        return Object.values(data).map((f)=>get(f))
    }
    
    function groupByDataKey(key) {
        let values = new Set(flatten.map((f)=>{return f.parsed.data[key]}))
        let nested = []
        Array.from(values).sort().forEach((v)=>{
            nested.push(
                {key: v, values: flatten.filter((f)=>f.parsed.data[key]===v)}
            )
        })
        return nested
    }

    function groupByDataKeyValue(key, value) {
        let values = flatten.filter((f)=>{return f.parsed.data[key]==value})
        return values
    }

    return {
        groupByDataKey,
        groupByDataKeyValue
    }
}