import { config } from "./Config";
import { DayEditorState } from "./DayEditorState";
import { Exportable } from "./Exportable";
import { createTodayTimestamp } from "./Utils";

//took it from here: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
export function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

export class SearchParams extends Exportable{
    constructor(){
        super()
        // snakecase because it's url component
        this.group_name = config.defaultGroupName
        this.current_day_timestamp = createTodayTimestamp().toString()

        window.addEventListener('popstate', (function(event) {
            this.replaceParams()
        }).bind(this), false);
    }

    updateParams(){
        var params = this.exportData()
        
        Object.keys(params).forEach(key=>{
            var value = getParameterByName(key)
            if(value!=null){
                this[key] = value
            }
        })
        this.replaceParams()
    }
    replaceParams(){
        var params = this.exportData()
        var searchParams = new URLSearchParams(window.location.search);
        
        Object.keys(params).forEach(key=>{
            searchParams.set(key, this[key]);
        })

        var url = window.location.href
        if(url.indexOf("?")!=-1) url = url.substring(0, url.indexOf("?"))
        url += "?" + searchParams.toString();
        window.history.replaceState(null, null, url);
    }
}
var searchParams = new SearchParams()
window.searchParams = searchParams
export {searchParams}