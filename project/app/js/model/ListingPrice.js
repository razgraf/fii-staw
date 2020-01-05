import {ClassHelper} from "./../../base/util.js";

/**
 * Created by @VanSoftware on 2019-06-09.
 */

class ListingPrice{
    get AID() {
        return this._AID;
    }

    set AID(value) {
        this._AID = value;
    }


    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }

    get currency() {
        return this._currency;
    }

    set currency(value) {
        this._currency = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }


    constructor(object){


        this.AID = ClassHelper.getValue(object, MODEL_LISTING_PRICE_KEY_AID);
        this.context=  ClassHelper.getValue(object, MODEL_LISTING_PRICE_KEY_CONTEXT);
        this.currency = ClassHelper.getValue(object, MODEL_LISTING_PRICE_KEY_CURRENCY);
        this.value = ClassHelper.getValue(object, MODEL_LISTING_PRICE_KEY_VALUE);
        this.createdAt = ClassHelper.getValue(object, MODEL_LISTING_PRICE_KEY_CREATED_AT);

    }




    toString(){
        return this.value + " " + this.currency
    }
}


export default ListingPrice;