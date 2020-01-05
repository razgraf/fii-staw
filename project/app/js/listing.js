/**
 * Created by @VanSoftware on 20/03/2019.
 */

import {ClassHelper, Structure, Slider, VanLoading} from "./../base/util.js";
import VanModal from "./../library/van-modal/modal.js";
import Listing from "./model/Listing.js";
import ListingPrice from "./model/ListingPrice.js";
import MyMap from "./../map/system/Map.js";

/**
 *
 * @type {Listing|{}}
 */
let GLOBAL_LISTING = {};


let TOOLBAR_HEIGHT= 76;
let PANEL_PADDING_TOP = 30;
let PANEL_HEIGHT = null;
let LEFT_HEIGHT = null;
let LEFT_TOP = null;
let SCROLL_TOP = null;


let _GRAPH = null;


let _PRICE_HISTORY_RENT = [];
let _PRICE_HISTORY_BUY = [];


document.addEventListener("DOMContentLoaded", init);



function init(){
    Structure.initNavigation();

    GLOBAL_LISTING = new Listing(DUMMY_LISTINGS[0]);


    VanLoading.showBlock(()=>{},30000);

    Listing.get(API["AID"])
        .then(r => {
            let {listing} = r["result"];
            GLOBAL_LISTING = new Listing(listing);
            console.log(GLOBAL_LISTING);



            setTimeout(()=>{
                if(_GLOBAL_MAP) _GLOBAL_MAP.pinListings([GLOBAL_LISTING], _GLOBAL_MAP.state.map);
                else console.error("Missing _GLOBAL_MAP");
            },1000);




            bindListingProfile();

        })
        .catch(e => {console.log(e);})





}




function bindListingProfile(){

    if(ClassHelper.isEmpty(API) || ClassHelper.isEmpty(API["type"]) || ClassHelper.isEmpty(API["AID"]) ) {
        window._MODAL_ERROR_API_MISCONFIGURATION = new VanModal({
            ID: "_MODAL_ERROR_API_MISCONFIGURATION",
            title: "Oops 😳",
            type: ["block", "mini"],
            content: '<p class="description">Unfortunately, the listing is not valid any more. Sorry for this. Please go back look for another one from our portfolio.</p>',
            buttons: [VanModal.button("View other listings", "deny", function () {
                window.location.href = API["parent"];
            })]
        }).init_modal();

        window._MODAL_ERROR_API_MISCONFIGURATION.show();
        VanLoading.showBlock(()=>{},999999999);
        return;

    }

    initPriceHistory();

    document.querySelector("body").dataset.type = API["type"];

    document.querySelector("header > .content > .titleCard > .content > .title > p").innerText = GLOBAL_LISTING.title;
    document.querySelector("header > .content > .titleCard > .content > .price > p").innerText = GLOBAL_LISTING.parsePrice(API["type"]);

    document.querySelector("section#description > .content.about > .description > p").innerText = GLOBAL_LISTING.description;
    document.querySelector("section#description > .content.about > .address > p").innerText = GLOBAL_LISTING.address.toString();


    document.querySelector("#bookmarkButton").dataset.bookmark = GLOBAL_LISTING.bookmarked;
    document.querySelector("#bookmarkButton").onclick = ()=>{GLOBAL_LISTING.doBookmark();};

    GLOBAL_LISTING.buildProfileDescriptionItems(document.querySelector("section#description > .content.items"));

    let background = document.querySelector("header .background");
    for(let i = 0; i < GLOBAL_LISTING.images.length; i++){
        if(i === 0) {
            document.querySelector("#header_image_1").src =  GLOBAL_LISTING.images[i].url;
            if(GLOBAL_LISTING.images.length === 1){
                background.querySelector(".primary").classList.add("single");
            }
        }
        else {

           let backgroundItem = '<div class="secondary" data-id="'+i+'"><img  id="header_image_'+i+'"  alt="Listing cover secondary" src="" /></div>';
            background.insertAdjacentHTML("beforeend",backgroundItem);
            background.querySelector("div.secondary[data-id='"+i+"'] img").src =  GLOBAL_LISTING.images[i].url;
        }
    }


    Listing.find(
        {
            type : [GLOBAL_LISTING.type],
            similar : GLOBAL_LISTING.AID
        })
        .then(r => {
            let {listings} = r["result"];

            GLOBAL_LISTING.similar = ClassHelper.parseArrayElementWithClass(listings, element => new Listing(element));

            for(let i = 0; i < GLOBAL_LISTING.similar.length; i++){
                    GLOBAL_LISTING.similar[i].buildCard("#slider-similar", API["type"]);
            }

            Slider.doMove("#slider-arrow-left","#slider-similar",'left');
            Slider.doMove("#slider-arrow-right","#slider-similar",'right');


        })
        .catch(e => {console.log(e);});






    adaptActionPanel(window.scrollY);
    window.addEventListener("scroll", function(event) {adaptActionPanel(this.scrollY);}, false);



    VanLoading.hideBlock();

}




function initPriceHistory(){



   // showPriceHistory();


    GLOBAL_LISTING.getPriceHistory()
        .then(r => {
            console.log(r);
            let prices=  r["result"]["price"];

            for(let i = 0; i < prices.length; i++){
                let p = new ListingPrice(prices[i]);
                if(p.context === MODEL_LISTING_PRICE_CONTEXT_BUY) _PRICE_HISTORY_BUY.push(p);
                else  if(p.context === MODEL_LISTING_PRICE_CONTEXT_RENT) _PRICE_HISTORY_RENT.push(p);
            }



            let GBuy =  document.getElementById('myChartBuy').getContext('2d');
            GBuy =  new Chart(GBuy, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: _PRICE_HISTORY_BUY.map(e => moment(e.createdAt,"YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY")),
                    datasets: [
                        {
                            label: 'Price History',
                            backgroundColor: 'rgb(126, 211, 33)',
                            borderColor: 'rgb(126, 211, 33)',
                            data: _PRICE_HISTORY_BUY.map(e =>  parseInt(e.value))
                        }
                    ]
                },

                options: {}
            });



            let GRent =  document.getElementById('myChartRent').getContext('2d');
            GRent =  new Chart(GRent, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: _PRICE_HISTORY_RENT.map(e => moment(e.createdAt,"YYYY-MM-DD hh:mm:ss").format("DD-MM-YYYY")),
                    datasets: [
                        {
                            label: 'Price History',
                            backgroundColor: 'rgb(65, 14, 238)',
                            borderColor: 'rgb(65, 14, 238)',
                            data: _PRICE_HISTORY_RENT.map(e => parseInt(e.value))
                        }
                    ]
                },

                options: {}
            });




        })
        .catch(e => {console.log(e);});




}


/**
 * ------------------------
 *
 * Design Utilities
 *
 * ------------------------
 * @param top
 */

function adaptActionPanel(top){

    let panel = document.querySelector("#actionsPanel");
    let left = document.querySelector("main > .content > .left");

    if(PANEL_HEIGHT === null || LEFT_HEIGHT === null || LEFT_TOP === null || SCROLL_TOP === null){

        let leftBounds = left.getBoundingClientRect();
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;


        PANEL_HEIGHT = panel.scrollHeight;
        LEFT_HEIGHT = left.scrollHeight;
        LEFT_TOP = leftBounds.top;
        SCROLL_TOP = scrollTop;

    }



    if(top <= (600 - PANEL_PADDING_TOP))   {panel.classList.remove("moving"); panel.classList.remove("stopped");}
    else if(top > (600 - PANEL_PADDING_TOP) && top < ( LEFT_TOP + SCROLL_TOP  + LEFT_HEIGHT - PANEL_HEIGHT - TOOLBAR_HEIGHT - PANEL_PADDING_TOP)){
        panel.classList.remove("stopped");
        panel.classList.add("moving");
    }
    else panel.classList.add("stopped");
}





const googleDefined = (callback) => typeof google !== 'undefined' ? callback() : setTimeout(() => googleDefined(callback), 100)
googleDefined(() => {
    let m = new MyMap();
    m.initMap();
});


