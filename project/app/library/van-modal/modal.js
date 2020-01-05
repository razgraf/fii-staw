/**
 * Created by @VanSoftware on 2019-04-05.
 */
'use strict';

import {ClassHelper} from "../../base/util.js";


/*
Example

new VanModal({
                ID: "ID-modal",
                title: "Title",
                type: "full-screen", /default /mini
                extra : "service-story-modal",
                content: "<div class='Main'></div>"
                buttons: [VanModal.button("Interesează-te de acest serviciu","accept",function(){window.location.href = "contact.php";})],
                callback_init : function(modal){}
            }).init_modal();
 */

export default class VanModal{
    get extra() {
        return this._extra;
    }

    set extra(value) {
        this._extra = value;
    }
    get main() {
        return this._main;
    }

    set main(value) {
        this._main = value;
    }
    /**
     *
     * @returns {Object} used to hold extra objects such as a modal or some other data
     */
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
    get callback_close() {
        return this._callback_close;
    }

    set callback_close(value) {
        this._callback_close = value;
    }
    get callback_show() {
        return this._callback_show;
    }

    set callback_show(value) {
        this._callback_show = value;
    }
    get callback_init() {
        return this._callback_init;
    }

    set callback_init(value) {
        this._callback_init = value;
    }
    get buttons() {
        return this._buttons;
    }

    set buttons(value) {
        this._buttons = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }
    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }
    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }
    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }

    /**
     *
     * @param {Object} object
     * @param {String|Number} object.ID
     * @param {String} object.title
     * @param {String|Array} [object.type]
     * @param {HTMLElement} object.content
     * @param {Array} [object.buttons]
     * @param {Function} [object.callback_init]
     * @param {Function} [object.callback_show]
     * @param {Function} [object.callback_close]
     * @returns {VanModal}
     */
    constructor(object){
        this._ID = ClassHelper.sanitize(ClassHelper.getValue(object,"ID"));
        this._title = ClassHelper.getValue(object, "title");
        this._type = [... ClassHelper.getValue(object, "type")];
        this._content = ClassHelper.getValue(object, "content");
        this._buttons = ClassHelper.getValue(object, "buttons");
        this._callback_init = ClassHelper.getValue(object, "callback_init");
        this._callback_show = ClassHelper.getValue(object,"callback_show");
        this._callback_close = ClassHelper.getValue(object,"callback_close");
        this._extra = ClassHelper.getValue(object,"extra");
        this._data = {};

        if(ClassHelper.isEmpty(this.ID) || ClassHelper.isEmpty(this.title)){console.error("Please provide attributes for van modal: ID, title, type, content"); return null;}
        if(ClassHelper.isEmpty(this.type)) this.type = "default";

        return this;
    }

    /**
     *
     * @returns {VanModal}
     */
    init_modal(){

        let reference = this;
        let elementSelector = ".van-modal[data-library='van'][data-id='"+this.ID+"']";

        if(ClassHelper.isEmpty(this.ID)){console.error("Please provide a valid ID for the van modal."); return null;}
        if(!ClassHelper.isEmpty(document.querySelector(elementSelector))){console.error("ID already in use. Please provide a unique ID for the van modal."); return null;}

        /**
         * Auto generate the modal
         */

        let print =
                '<div data-id="'+this.ID+'" class="van-modal" data-library="van" '+(ClassHelper.isEmpty(this.extra)? "" : "data-extra=\""+ this.extra + "\"")+' >' +
                    '<div class="overlay"></div>' +
                    '<div class="container">' +
                        '<div class="card">' +
                            '<div class="header">' +
                                '<h3></h3>' +
                                    '<div class="btn-close">' +
                                        '<svg height="12px" width="12px">' +
                                            '<line x1="1" y1="11" x2="11" y2="1" stroke="black" stroke-width="2" stroke-linecap="round"></line>' +
                                            '<line x1="1" y1="1" x2="11" y2="11" stroke="black" stroke-width="2" stroke-linecap="round"></line>' +
                                        '</svg>' +
                                    '</div>' +
                                '</div>' +
                            '<div class="content"></div>' +
                            '<div class="footer">' +

                            '</div>' +
                        '</div>' +
                    '</div>' +
            '</div>';

        document.querySelector("body").insertAdjacentHTML("beforeend",print);

        this.parent = document.querySelector(elementSelector);
        if(ClassHelper.isEmpty(this.parent)){console.error("Missing modal parent element."); return null;}

        if(this.type) for(let i = 0; i < this.type.length; i++) this.parent.classList.add(this.type[i]);

        this.parent.querySelector(" .container > .card > .header > h3").innerText = this.title;
        this.parent.querySelector(" .container > .card > .header > .btn-close").onclick = () => {reference.close()};

        this.main = this.parent.querySelector(" .container > .card > .content");
        this.main.insertAdjacentHTML("afterbegin",this.content);




        let footer = this.parent.querySelector("  .container > .card > .footer");

        footer.insertAdjacentHTML("beforeend",'<div class="btn-close"><span>Close</span></div>');
        footer.querySelector(" .btn-close").onclick = ()=>{reference.close();};

        this.parent.querySelector(" .overlay").onclick = () => {reference.close();};

        if(!ClassHelper.isEmpty(this.buttons) && this.buttons.length > 0)
            for(let i = 0; i < this.buttons.length; i++){
                let btn = this.buttons[i];
                if(btn !== null &&
                    ClassHelper.isDataSetInObject("title", btn) &&
                    ClassHelper.isDataSetInObject("type", btn) &&
                    ClassHelper.isDataSetInObject("callback", btn)){

                    let title = ClassHelper.getValue(btn, "title");
                    let type = ClassHelper.getValue(btn, "type");
                    let btn_callback = ClassHelper.getValue(btn, "callback");

                    footer.insertAdjacentHTML("beforeend",'<div data-id="'+(i+1)+'" class="btn btn-'+type+'"><span>'+title+'</span></div>');
                    if(btn_callback !== null && typeof btn_callback === 'function') footer.querySelector(" .btn[data-id='"+(i+1)+"']").onclick = (event)=>{btn_callback(event.target)};
                }
            }


        if(!ClassHelper.isEmpty(this.type) && this.type.includes("block")){
            footer.querySelector(".btn-close").remove();
            this.parent.querySelector(" .container > .card > .header > .btn-close").remove();
            this.parent.querySelector(" .overlay").style.pointerEvents = "none";

        }


        if(this.callback_init !== null && typeof this.callback_init === 'function') this.callback_init(reference);

        return this;
    }

    close(local_callback = null){
        let reference = this;
        if(ClassHelper.isEmpty(this.parent) || this.parent.length === 0){console.error("Please init the van modal first."); return null;}
        if(this.callback_close !== null && typeof this.callback_close === 'function') this.callback_close(reference);
        if(local_callback !== null && typeof local_callback === 'function') local_callback(reference);

        this.parent.classList.remove("open");
        document.querySelector("html").style.overflowY = "scroll";
        setTimeout(()=>{ reference.parent.style.display = "none";},400);

        return this;
    }

    show(local_callback = null){
        let reference = this;
        if(ClassHelper.isEmpty(this.parent) || this.parent.length === 0){console.error("Please init the van modal first."); return null;}
        if(this.callback_show !== null && typeof this.callback_show === 'function') this.callback_show(reference);
        if(local_callback !== null && typeof local_callback === 'function') local_callback(reference);

        reference.parent.style.display = "block";
        this.parent.classList.add("open");
        document.querySelector("html").style.overflowY = "hidden";


        return this;

    }


    static button(title = "Button", type="default", callback = function(){}){
        return {
            title : title,
            type : type,
            callback : callback
        };
    }

}