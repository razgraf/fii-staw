import {ClassHelper} from "./../../base/util.js";
import LocalSearchField from "./LocalSearchField.js";

/**
 * Created by @VanSoftware on 2019-06-12.
 */


class LocalSearch{
    get callbackSearch() {
        return this._callbackSearch;
    }

    set callbackSearch(value) {
        this._callbackSearch = value;
    }

    get callbackMapSearch() {
        return this._callbackMapSearch;
    }

    set callbackMapSearch(value) {
        this._callbackMapSearch = value;
    }




    /**
     *
     * @param {Function} callbackSearch
     * @param {Function} callbackMapSearch
     */
    constructor(callbackSearch, callbackMapSearch){
        this.callbackSearch = callbackSearch;
        this.callbackMapSearch = callbackMapSearch;
    }

    init(){


        this.FIELDS = [];
        this.parentSelector = "#filters .grid-wrapper";

        this.buildFilters();

    }



    buildFilters(){

        let parent = document.querySelector(this.parentSelector);
        if(ClassHelper.isEmpty(parent)) { console.error("Missing parent container for filter fields."); return;}



        let supported = MODEL_LISTING_DATA_CONTEXT_SEARCH_SUPPORTED;
        for(let i = 0; i < supported.length; i++){

            if(supported[i].context === MODEL_LISTING_DATA_CONTEXT_SEARCH){
                if(!ClassHelper.isEmpty(API) && !ClassHelper.isEmpty(API["PAGE_SEARCH_KEY"]))
                    supported[i].value = API["PAGE_SEARCH_KEY"];
            }

            let field = new LocalSearchField({
                ...supported[i],

                ID : "localSearchFiler-"+ supported[i].context,
                type : supported[i].type,
                parent : parent,
                context : supported[i].context,
                placeholder : "",
                value : supported[i].hasOwnProperty("value") ? supported[i].value : null,
                min : supported[i].hasOwnProperty("min") ? supported[i].min : null,
                max : supported[i].hasOwnProperty("max") ?supported[i].max : null,
                dataset : supported[i].hasOwnProperty("dataset") ?supported[i].dataset : null,
                specialClass : (supported[i].context===MODEL_LISTING_DATA_CONTEXT_SEARCH) ? ["search"] : [],
            });

            field.build();
            this.FIELDS.push(field);

        }



        parent.insertAdjacentHTML("beforeend",'<div class="item refresh"><span>Search</span></div><div class="item map"><i class="material-icons-outlined">map</i><span>Search on a map</span></div>');
        parent.querySelector(".item.refresh").onclick = ()=>{this.doSearch(this.callbackSearch);};
        parent.querySelector(".item.map").onclick = ()=>{this.doSearch(this.callbackMapSearch);};


    }


    doSearch(callback){
        let object = {};

        for(let i = 0; i < this.FIELDS.length; i++){
            object["f-"+String(this.FIELDS[i].context)] = {
                context : this.FIELDS[i].context,
                value : this.FIELDS[i].getValue()
            }
        }

        console.log(object);

        if(!ClassHelper.isEmpty(callback) && typeof callback === 'function') callback(object);


    }



}

export default LocalSearch;