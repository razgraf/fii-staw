/**
 * Created by @VanSoftware on 20/03/2019.
 */


'use strict';


import {ClassHelper,Alert, VanLoading} from "./../../base/util.js";
import ListingPrice from "./ListingPrice.js"
import ListingData from "./ListingData.js"
import Address from "./Address.js"


class Listing{
    get bookmarked() {
        return this._bookmarked;
    }

    set bookmarked(value) {
        this._bookmarked = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get images() {
        return this._images;
    }

    set images(value) {
        this._images = value;
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

    /**
     *
     * @return {Array<Listing>}
     */
    get similar() {
        return this._similar;
    }

    /**
     *
     * @param {Array<Listing>} value
     */
    set similar(value) {
        this._similar = value;
    }
    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }
    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }
    get AID() {
        return this._AID;
    }

    set AID(value) {
        this._AID = value;
    }
    get badge() {
        return this._badge;
    }

    set badge(value) {
        this._badge = value;
    }
    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
    get info() {
        return this._info;
    }

    set info(value) {
        this._info = value;
    }
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }


    constructor(object){
        this.AID = ClassHelper.getValue(object, MODEL_LISTING_KEY_AID);
        this.title = ClassHelper.getValue(object, MODEL_LISTING_KEY_TITLE);
        this.description = ClassHelper.getValue(object, MODEL_LISTING_KEY_DESCRIPTION);
        this.type = ClassHelper.getValue(object, MODEL_LISTING_KEY_TYPE);
        this.images = ClassHelper.getArray(object, MODEL_LISTING_KEY_IMAGES);
        if(ClassHelper.isEmpty(this.images) || this.images.length === 0) this.images.push({"url" : ROOT+"image/apartment1_3.jpg", "main" : true});
        this.price = ClassHelper.getObject(object, MODEL_LISTING_KEY_PRICE);
        this.description =  ClassHelper.getValue(object, MODEL_LISTING_KEY_DESCRIPTION);
        this.createdAt = ClassHelper.getValue(object, MODEL_LISTING_KEY_CREATED_AT);
        this.updatedAt = ClassHelper.getValue(object, MODEL_LISTING_KEY_UPDATED_AT);
        this.bookmarked = ClassHelper.getValue(object, MODEL_LISTING_KEY_BOOKMARKED);
        /** ----- */
        /** ----- */
        this.address = new Address(ClassHelper.getObject(object, MODEL_LISTING_KEY_ADDRESS));
        /** ----- */
        /** ----- */
        this.price = {};
        let temp  = ClassHelper.getObject(object, MODEL_LISTING_KEY_PRICE);
        for(let key in temp ) if(temp.hasOwnProperty(key) && !ClassHelper.isEmpty(temp[key])) this._price[key] = new ListingPrice(temp[key]);
        /** ----- */
        /** ----- */

        this.data = ClassHelper.parseArrayElementWithClass(ClassHelper.getArray(object, MODEL_LISTING_KEY_DATA), (e) => new ListingData(e));
        this.badge = [];
        this.info = [];

        this.badge.push(new ListingData({
            AID : "DADADA",
            context  : MODEL_LISTING_DATA_CONTEXT_TYPE,
            label : "Type",
            value : (this.type === MODEL_LISTING_TYPE_APARTMENT) ? "Apartment" :
                (this.type === MODEL_LISTING_TYPE_HOUSE) ? "House" : "Office"
        }));

        for(let item of this.data){
            if(ClassHelper.isEmpty(item)) continue;
            if(!ClassHelper.isEmpty(item.context) && MODEL_LISTING_DATA_CONTEXT_BADGES.includes(parseInt(item.context)))
                this.badge.push(item);
            else
                this.info.push(item);
        }


        /** ----- */
        /** ----- */


        this.similar = [];

    }

    buildCard(parentSelector = "#slider-rent", listing_type = MODEL_LISTING_PRICE_CONTEXT_RENT){

        let parent = document.querySelector(parentSelector);
        if(parent === null){
            console.error("Parent "+parentSelector+" was not found.");
            return;
        }

        parent.insertAdjacentHTML("beforeend",
            '<a class="listing-item" data-type="'+listing_type+'" data-aid="'+this.AID+'"> ' +
            '<div class="main"> ' +
                '<div class="image"><img alt="'+this.title+'" src=""></div> ' +
                '<div class="content">' +

            '<p class="heading"><span class="title"></span><span>• Visit <i class="material-icons-round">outlined_flag</i></span></p>' +

            '</div> ' +
            '</div> ' +
            '<div class="badges"></div> '+
            '</a> ');

        let element = parent.querySelector(".listing-item[data-aid='"+this.AID+"']");
        if(element === null) {console.error("Child item with the AID = "+this.AID+" was not found."); return;}

        element.querySelector(".main > .image > img").src = (()=>{ if(this.images) for(let image of this.images) if(ClassHelper.isDataSetInObject("main", image) && !ClassHelper.isEmpty(image["main"])) return image.url; return null; })();


        let title = this.title;
        title = (title.length > 46  ) ?  title.substr(0, 43)+"..." : title;



        element.querySelector(".main > .content > .heading > .title").innerText = title + element.querySelector(".main > .content > .heading > .title").innerText;


        let pickedInfo = (this.info.filter( e => MODEL_LISTING_DATA_CONTEXT_INFO.includes(e.context)));
        let pickedString = "";for(let i = 0; i < Math.min(pickedInfo.length, 3); i++) pickedString += ((i===0) ? "" : " • ") +pickedInfo[i].toString();

        element.querySelector(".main > .content").insertAdjacentHTML("beforeend", '<p data-type="info" class="info"></p>');
        element.querySelector(".main > .content > p.info[data-type='info']").innerText = pickedString;


        element.querySelector(".main > .content").insertAdjacentHTML("beforeend", '<p data-type="address" class="info"></p>');
        element.querySelector(".main > .content > p.info[data-type='address']").innerText = this.address.toString(true);




        element.querySelector(".main > .content").insertAdjacentHTML("beforeend", '<p class="info money"></p>');
        element.querySelector(".main > .content > .info.money").innerText =
            "• " + ( (listing_type === MODEL_LISTING_PRICE_CONTEXT_RENT) ? ClassHelper.sanitize(this.price[MODEL_LISTING_PRICE_CONTEXT_RENT].toString(), "Contact owner") + " / month"  :  ClassHelper.sanitize(this.price[MODEL_LISTING_PRICE_CONTEXT_BUY].toString(), "Contact owner for") + " starting price");

        let badges = element.querySelector(".badges");
        for(let i = 0; i < Math.min(5, this.badge.length); i++){
            badges.innerHTML += '<div class="item" data-id="'+i+'"> ' + '<img alt="Badge" src=""> ' + '<p></p> ' + '</div> ';
            let item =  badges.querySelector(".item[data-id='"+i+"']");
            let text = this.badge[i].toString();

            item.querySelector("img").src = this.badge[i].icon.gray;
            item.querySelector("p").innerText = text;

        }

        element.href = "listing.php?d="+ClassHelper.prettifyURL(this.title)+"&e="+this.AID+"&t="+listing_type;

    }


    static clickPaginator(parentSelector = "#slider-rent") {
        let parent = document.querySelector(parentSelector); if (parent === null) return;
        let element = parent.querySelector(".listing-item.paginator");  if (element === null) return;

        element.click();
    }


    /**
     *
     * @param {String} parentSelector - DOM Element name for query selector
     * @param listing_type
     * @param {String} hContent - content for header text
     * @param {String} bContent - content for button text
     * @param {Function} callback - callback function for click
     */




    static buildPaginator(parentSelector = "#slider-rent", listing_type = MODEL_LISTING_PRICE_CONTEXT_RENT, hContent, bContent, callback = (element)=>{}){
        let parent = document.querySelector(parentSelector);
        if(parent === null){
            console.error("Parent "+parentSelector+" was not found.");
            return;
        }

        parent.insertAdjacentHTML("beforeend",
            '<a data-type="'+listing_type+'"  class="listing-item paginator"> ' +
            '<div class="main"> ' +
            '<p></p>'+
            '<span></span>'+
            '</div> ' +
            '</a> ');


        let element = parent.querySelector(".listing-item.paginator");
        if(ClassHelper.isEmpty(element)) {console.error("Paginator not found."); return;}

        if(!ClassHelper.isEmpty(callback) && typeof callback === 'function') element.onclick = ()=>{ callback(element); };
        element.querySelector(".main > p").innerText = hContent;
        element.querySelector(".main > span").innerText = bContent;


    }

    parsePrice(listing_type = MODEL_LISTING_PRICE_CONTEXT_RENT){
       return (
        "• "
        + ( (listing_type === MODEL_LISTING_PRICE_CONTEXT_RENT)
            ? ClassHelper.sanitize(this.price[MODEL_LISTING_PRICE_CONTEXT_RENT], "Contact owner") + " / month"
            : ClassHelper.sanitize(this.price[MODEL_LISTING_PRICE_CONTEXT_BUY], "Contact owner for") + " starting price")
       )
    }





    buildProfileDescriptionItems(parent){

        if(ClassHelper.isEmpty(parent)){
            console.error("Missing profile parent.");
            return;
        }

        for(let i = 0; i < this.data.length; i++){
            let print =
                '<div data-id="'+i+'" class="item"> ' +
                    '<div class="icon"><img alt="icon" src="" /></div> ' +
                    '<div class="main"> ' +
                        '<div class="label"><p></p></div> ' +
                        '<div class="content"><p></p></div> ' +
                    '</div> ' +
                '</div>';

            parent.insertAdjacentHTML("beforeend",print);

            let element = parent.querySelector(".item[data-id='"+i+"']");
            if(ClassHelper.isEmpty(element)){ continue; }


            let image = ListingData.getImageIcon(this.data[i].context).primary;
            let label = ListingData.getLabel(this.data[i].context);
            let score = this.data[i].value;
            let text = this.data[i].text;



            element.querySelector(".icon > img").src = image;
            element.querySelector(".main > .label > p").innerText = label;
            element.querySelector(".main > .content > p").innerText = score + (ClassHelper.isEmpty(text) ? " " :  " • " + text);

        }


    }


    static get(AID){
        if(ClassHelper.isEmpty(API)){console.error("Missing API."); return;}
        if(ClassHelper.isEmpty(AID)){console.error("Missing AID."); return;}

        let URL = API["URL_LISTING_GET"] + "?AID="+AID;


        return new Promise((resolve, reject) => {
            fetch(URL ,{
                method : "GET",
                headers: {'Content-Type': 'application/json'},
                // credentials: 'include',

            })
                .then(response => {
                    if(response.ok) return response.json();
                    throw response;
                })
                .then(response => {
                    resolve(response);
                })
                .catch(response =>{
                    response.json().then((response)=>{
                        reject(response);
                    })
                });


        });


    }


    /**
     *
     * @param {Object} params
     * @param {int} [params.limit]
     * @param {int} [params.offset]
     * @param {Array<int>} [params.type] MODEL_LISTING
     * @return {Promise<Object>}
     */
    static find(params){
        return new Promise((resolve, reject) => {

            if(ClassHelper.isEmpty(API)){console.error("Missing API."); reject(null); return;}
            let URL = API["URL_LISTINGS_FIND"] + "?" + Object.keys(params).map(k => k + '=' + params[k]).join('&');



            fetch(URL ,{
                method : "GET",
                headers: {
                    'Content-Type': ' application/json',
                },
                // credentials: 'include'

            })
                .then(response => {
                    console.log(response.ok);
                    if(response.ok) return response.json();
                    throw response;
                })
                .then(response => {
                    resolve(response);
                })
                .catch(response =>{
                    console.error(response);
                    response.json().then((response)=>{
                        reject(response);
                    })
                });


        })

    }

    getPriceHistory(){

        if(ClassHelper.isEmpty(this.AID)) return null;


        return new Promise((resolve, reject) => {

            if(ClassHelper.isEmpty(API)){console.error("Missing API."); reject(null); return;}
            let URL = API["URL_LISTING_PRICE_HISTORY"] + "?AID=" + this.AID;

            fetch(URL ,{
                method : "GET",
                headers: {'Content-Type': 'application/json'},
                // credentials: 'include'

            })
                .then(response => {
                    if(response.ok) return response.json();
                    throw response;
                })
                .then(response => {
                    resolve(response);
                })
                .catch(response =>{
                    response.json().then((response)=>{
                        reject(response);
                    })
                });
        });


    }



    doBookmark(){


        let data = new FormData();
        data.append("AID" , this.AID);
        VanLoading.showBlock(()=>{}, 10000);

        fetch(API["URL_LISTING_BOOKMARK"] ,{
            method : 'POST',
            body : data,
            // credentials: 'include'

        })
            .then(response => {
                if(response.ok) return response.json();
                throw response;
            })
            .then(response => {
                Alert.showAlert("Bookmark toggled successfully",window.ALERT_TYPE_SUCCESS, 1500, ()=>{
                    window.location.reload();
                });
            })
            .catch(response =>{
                VanLoading.hideBlock();
                response.json().then((response)=>{
                    console.error(response);
                    if(!ClassHelper.isEmpty(response) && !ClassHelper.isEmpty(response["message"]))   Alert.showAlert(response["message"]);
                    else Alert.showAlert("Oops. Something doesn't seem right. Please try again.");
                })
            })
            .finally(()=>{});




    }




}

export default Listing;