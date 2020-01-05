import {ClassHelper} from "./../../base/util.js";

/**
 * Created by @VanSoftware on 2019-06-09.
 */


class ListingData{
    get icon() {
        return this._icon;
    }

    set icon(value) {
        this._icon = value;
    }
    get AID() {
        return this._AID;
    }

    set AID(value) {
        this._AID = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }




    constructor(object) {

        this.AID = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_AID);
        this.value = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_VALUE);
        this.context = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_CONTEXT); if(!ClassHelper.isEmpty(this.context)) this.context = parseInt(this.context);
        this.label = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_LABEL); if(!ClassHelper.isEmpty(this.label)) this.label = ListingData.getLabel(this.context);
        this.createdAt = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_CREATED_AT);
        this.updatedAt = ClassHelper.getValue(object, MODEL_LISTING_DATA_KEY_UPDATED_AT);


        this.icon = ListingData.getImageIcon(this.context);
    }



    static getLabel(context){
        let label = 'Type';
        if(ClassHelper.isEmpty(context)) return label;

        switch (context) {
            case MODEL_LISTING_DATA_CONTEXT_TRAFFIC : label = "Traffic"; break;
            case MODEL_LISTING_DATA_CONTEXT_CROWD : label = "Crowd"; break;
            case MODEL_LISTING_DATA_CONTEXT_NOISE : label = "Noise"; break;
            case MODEL_LISTING_DATA_CONTEXT_LOCATION : label = "Location"; break;
            case MODEL_LISTING_DATA_CONTEXT_FUN : label = "Fun & Frolics"; break;
            case MODEL_LISTING_DATA_CONTEXT_ROOMS : label = "Rooms"; break;
            case MODEL_LISTING_DATA_CONTEXT_SIZE : label = "Size"; break;
            case MODEL_LISTING_DATA_CONTEXT_PRICE : label = "Min. Price"; break;
            case MODEL_LISTING_DATA_CONTEXT_SAFETY : label = "Safety"; break;
            case MODEL_LISTING_DATA_CONTEXT_SEARCH : label = "Search"; break;
            case MODEL_LISTING_DATA_CONTEXT_TYPE : label = "Type"; break;
        }

        return label;

    }



    static getImageIcon(context){
        let icon = 'image/icon/rocket';
        if(!ClassHelper.isEmpty(context))
            switch (context) {
                case MODEL_LISTING_DATA_CONTEXT_TRAFFIC :  icon = ROOT + "image/icon/rocket";break;
                case MODEL_LISTING_DATA_CONTEXT_CROWD : icon = ROOT + "image/icon/user-group"; break;
                case MODEL_LISTING_DATA_CONTEXT_NOISE : icon = ROOT + "image/icon/volume-full"; break;
                case MODEL_LISTING_DATA_CONTEXT_LOCATION : icon = ROOT + "image/icon/map"; break;
                case MODEL_LISTING_DATA_CONTEXT_FUN : icon= ROOT + "image/icon/ticket"; break;
                case MODEL_LISTING_DATA_CONTEXT_ROOMS : icon = ROOT + "image/icon/room"; break;
                case MODEL_LISTING_DATA_CONTEXT_SIZE : icon = ROOT + "image/icon/size"; break;
                case MODEL_LISTING_DATA_CONTEXT_PRICE : icon= ROOT + "image/icon/price"; break;
                case MODEL_LISTING_DATA_CONTEXT_SAFETY : icon = ROOT + "image/icon/security"; break;
                case MODEL_LISTING_DATA_CONTEXT_SEARCH :  icon = ROOT + "image/icon/search"; break;
                case MODEL_LISTING_DATA_CONTEXT_TYPE :  icon = ROOT + "image/icon/home"; break;
            }


        return {
            gray : icon+"-gray.svg",
            primary : icon+"-primary.svg",
        };

    }


    toString(){
        if(this.context === MODEL_LISTING_DATA_CONTEXT_SIZE) return this.label + ": " +this.value + " sq.ft.";
        return this.label + ": " +this.value;
    }

}

export default ListingData;