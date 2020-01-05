/**
 * Created by @VanSoftware on 20/03/2019.
 */

import Listing from './model/Listing.js'
import {Structure, Slider, ClassHelper} from "./../base/util.js";



document.addEventListener("DOMContentLoaded", init);

let _GLOBAL_BUY_LISTINGS = [];
let _GLOBAL_RENT_LISTINGS = [];

function init(){
    Structure.initNavigation();

    Slider.doMove("#slider-buy-arrow-left","#slider-buy",'left');
    Slider.doMove("#slider-buy-arrow-right","#slider-buy",'right');

    Slider.doMove("#slider-rent-arrow-left","#slider-rent",'left');
    Slider.doMove("#slider-rent-arrow-right","#slider-rent",'right');



    Listing.find({
        type : [1, 2, 3],
        recommended : true,
        limit : 10,
        context : MODEL_LISTING_PRICE_CONTEXT_BUY
    })
        .then(r => {
            console.log(r);
            let {listings} = r["result"];
            for(let i = 0; i < listings.length; i++) _GLOBAL_BUY_LISTINGS.push(new Listing(listings[i]));
            printBuy();
        })
        .catch(e => {console.log(e);});



    Listing.find({
        type : [1, 2, 3],
        limit : 10,
        recommended : true,
        context : MODEL_LISTING_PRICE_CONTEXT_RENT
    })
        .then(r => {
            console.log(r);
            let {listings} = r["result"];
            for(let i = 0; i < listings.length; i++) _GLOBAL_RENT_LISTINGS.push(new Listing(listings[i]));
            printRent();
        })
        .catch(e => {console.log(e);})


    let doBottomSearch = ()=>{
        let value =   document.querySelector("#bottomSearchField").value;
        window.location.href = "./buy?s="+value;

    };

    document.querySelector("#bottomSearchButton").onclick = ()=>{doBottomSearch()};
    document.querySelector("#bottomSearchButtonFilters").onclick = ()=>{doBottomSearch()};


}


function printBuy(){
    for(let i = 0; i < _GLOBAL_BUY_LISTINGS.length; i++){
        if(_GLOBAL_BUY_LISTINGS[i].price.hasOwnProperty(MODEL_LISTING_PRICE_CONTEXT_BUY))
            _GLOBAL_BUY_LISTINGS[i].buildCard("#slider-buy",MODEL_LISTING_PRICE_CONTEXT_BUY);
    }

    Listing.buildPaginator("#slider-buy",MODEL_LISTING_PRICE_CONTEXT_BUY,"Over 1000 other listings are waiting!","See all listings",(element)=>{
        element.href = "./buy"
    })


}



function printRent(){
    for(let i = 0; i < _GLOBAL_RENT_LISTINGS.length; i++){
        if(_GLOBAL_RENT_LISTINGS[i].price.hasOwnProperty(MODEL_LISTING_PRICE_CONTEXT_RENT))
            _GLOBAL_RENT_LISTINGS[i].buildCard("#slider-rent",MODEL_LISTING_PRICE_CONTEXT_RENT);
    }

    Listing.buildPaginator("#slider-rent",MODEL_LISTING_PRICE_CONTEXT_RENT,"Over 1000 other listings are waiting!","See all listings",(element)=>{
        element.href = "./rent"
    })

}
