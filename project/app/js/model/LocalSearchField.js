import {ClassHelper} from "./../../base/util.js";
import ListingData from "./ListingData.js";

/**
 * Created by @VanSoftware on 2019-06-12.
 */
class LocalSearchField{
    get elementInputAny() {
        return this._elementInputAny;
    }

    set elementInputAny(value) {
        this._elementInputAny = value;
    }
    get dataset() {
        return this._dataset;
    }

    set dataset(value) {
        this._dataset = value;
    }
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
    }
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
    get placeholder() {
        return this._placeholder;
    }

    set placeholder(value) {
        this._placeholder = value;
    }
    get context() {
        return this._context;
    }

    set context(value) {
        this._context = value;
    }
    get specialClass() {
        return this._specialClass;
    }

    set specialClass(value) {
        this._specialClass = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get elementInput() {
        return this._elementInput;
    }

    set elementInput(value) {
        this._elementInput = value;
    }




    /**
     *
     * @param {{parent: Element, min: *, max: *, context: number, ID: string, placeholder: string, type: number, dataset: null, specialClass: *}} object
     * @param {string} object.ID
     * @param {Element} object.parent
     * @param {MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT|MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT_NUMBER|MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SLIDER|MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SELECTOR} object.type
     * @param {int} object.context
     * @param {string} [object.placeholder]
     * @param {string} [object.value]
     * @param {int} [object.min]
     * @param {int} [object.max]
     * @param {Array<string>} [object.specialClass]
     */
    constructor(object){

        this.ID = ClassHelper.getValue(object,"ID");
        this.parent = ClassHelper.getValue(object,"parent");
        this.type = ClassHelper.getValue(object,"type");
        this.context = ClassHelper.getValue(object,"context");
        this.placeholder = ClassHelper.getValue(object,"placeholder");
        this.value = ClassHelper.getValue(object,"value");
        this.dataset = ClassHelper.getValue(object,"dataset");
        this.specialClass = ClassHelper.getArray(object,"specialClass"); if(ClassHelper.isEmpty(this.specialClass)) this.specialClass = [];


        this.element = null;
        this.elementInputAny = null;
        this.elementInput = null;


        this.min =  ClassHelper.getValue(object,"min");
        this.max =  ClassHelper.getValue(object,"max");


    }


    build(){
        switch (this.type) {
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT : // --> continue
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT_NUMBER : this.buildTextField(); break;
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SLIDER : this.buildSliderField(); break;
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SELECTOR : this.buildSelectField(); break;
        }
    }


    buildTextField(){

        let print =
            '<div data-context="'+this.context+'" class="item">' +
                '<img alt="Filter Icon" src="">' +
                '<div class="content">' +
                    '<label class="label"> </label>' +
                    '<input class="filterInput"/>' +
                '</div>' +
                '<div class="filterAny"><input type="checkbox"><label></label><p>Any</p></div>' +
            '</div>';

        this.parent.insertAdjacentHTML("beforeend",print);
        this.element = this.parent.querySelector(".item[data-context='"+this.context+"']");
        if(ClassHelper.isEmpty(this.element)){console.error("Missing filter DOM element.");return;}
        this.elementInput = this.element.querySelector(".content > input.filterInput");


        this.buildCommonBehaviour();

        console.log(this.value);

        this.elementInput.type = !ClassHelper.isEmpty(this.type) && this.type === MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT_NUMBER ? "number" : "text";





    }

    buildSliderField(){
        let print =
            '<div data-context="'+this.context+'" class="item">' +
                '<img alt="Filter Icon" src="">' +
                '<div class="content">' +
                    '<label class="label"></label>' +
                    '<input class="filterInput" type="range"/>' +
                    '<p class="mirror">0</p>' +
            '</div>' +
                    '<div class="filterAny"><input type="checkbox"><label></label><p>Any</p></div>' +
            '</div>';

        this.parent.insertAdjacentHTML("beforeend",print);

        this.element = this.parent.querySelector(".item[data-context='"+this.context+"']");
        if(ClassHelper.isEmpty(this.element)){console.error("Missing filter DOM element.");return;}
        this.elementInput = this.element.querySelector(".content > input.filterInput");

        this.buildCommonBehaviour();


        if(!ClassHelper.isEmpty(this.value))  this.element.querySelector("p.mirror").innerText = this.value;

        this.elementInput.onchange = (event)=>{
            this.element.querySelector("p.mirror").innerText =  event.target.value;
        };


    }


    buildSelectField(){

        let print =
            '<div data-context="'+this.context+'" class="item">' +
            '<img alt="Filter Icon" src="">' +
            '<div class="content">' +
                '<label class="label"></label>' +
                '<select></select>' +
            '</div>' +
                '<div class="filterAny"><input type="checkbox"><label></label><p>Any</p></div>' +
            '</div>';

        this.parent.insertAdjacentHTML("beforeend",print);

        this.element = this.parent.querySelector(".item[data-context='"+this.context+"']");
        if(ClassHelper.isEmpty(this.element)){console.error("Missing filter DOM element.");return;}
        this.elementInput = this.element.querySelector(".content > select");

        this.buildCommonBehaviour();



        if(!ClassHelper.isEmpty(this.dataset)) for(let i = 0; i < this.dataset.length; i++){
            this.elementInput.insertAdjacentHTML("beforeend","<option value='"+this.dataset[i].value+"' >"+this.dataset[i].name+"</option>");
        }



    }



    buildCommonBehaviour(){


        if(!ClassHelper.isEmpty(this.specialClass)) for(let i = 0; i < this.specialClass.length; i++) this.element.classList.add(this.specialClass[i]);



        this.element.querySelector("img").src = ListingData.getImageIcon(this.context).primary;
        this.element.querySelector(".content > .label").innerText = ListingData.getLabel(this.context);



        if(!ClassHelper.isEmpty(this.placeholder)) this.elementInput.placeholder = this.placeholder;
        if(!ClassHelper.isEmpty(this.value)) this.elementInput.value = this.value;



        this.elementInput.id = this.ID;
        this.element.querySelector(".content > .label").setAttribute("for",   this.elementInput.id);


        this.elementInputAny = this.element.querySelector("div.filterAny > input");
        this.elementInputAny.id = "any-"+this.ID;
        this.element.querySelector("div.filterAny > label").setAttribute("for",   this.elementInputAny.id);

        this.elementInputAny.onclick = (event)=>{
            if(event.target.checked) this.element.classList.add("any");
            else this.element.classList.remove("any");
        };

        if(!ClassHelper.isEmpty(this.placeholder)) this.elementInput.placeholder = this.placeholder;
        if(!ClassHelper.isEmpty(this.value)) this.elementInput.value = this.value;
        if(!ClassHelper.isEmpty(this.min)) this.elementInput.min = this.min;
        if(!ClassHelper.isEmpty(this.max)) this.elementInput.max = this.max;


        if(this.context !== MODEL_LISTING_DATA_CONTEXT_SEARCH)  this.elementInputAny.click();


    }


    getValue(){

        let value = '';
        switch (this.type) {
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT : // --> continue
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_TEXT_NUMBER :
                try{
                    value = this.elementInput.value;
                    if(this.elementInputAny.checked) value = null;
                }catch (e) {}
                break;
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SLIDER :
                try{
                    value = this.elementInput.value;
                    if(this.elementInputAny.checked) value = null;
                }catch (e) {}
                break;
            case MODEL_LISTING_DATA_CONTEXT_SEARCH_FIELD_TYPE_SELECTOR :
                try{
                    value = this.elementInput.value;
                    if(this.elementInputAny.checked) value = null;
                }catch (e) {}
                break;
        }

        return value;

    }



}

export default LocalSearchField;