/**
 * Created by @VanSoftware on 2019-04-04.
 */


const _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS = [];

class VanSlider{
    get force_video_outside() {
        return this._force_video_outside;
    }

    set force_video_outside(value) {
        this._force_video_outside = value;
    }
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }
    get modal_resize() {
        return this._modal_resize;
    }

    set modal_resize(value) {
        this._modal_resize = value;
    }
    get actions() {
        return this._actions;
    }

    set actions(value) {
        this._actions = value;
    }

    get dots() {
        return this._dots;
    }

    set dots(value) {
        this._dots = value;
    }
    get time() {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }
    get interval() {
        return this._interval;
    }

    set interval(value) {
        this._interval = value;
    }
    get arrows() {
        return this._arrows;
    }

    set arrows(value) {
        this._arrows = value;
    }
    get slides() {
        return this._slides;
    }

    set slides(value) {
        this._slides = value;
    }
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }
    get maxID() {
        return this._maxID;
    }

    set maxID(value) {
        this._maxID = value;
    }


    /**
     *
     * @param {Object} object
     * @param {String|Number} object.ID
     * @param {String|Number} object.title
     * @param {Number} [object.time]
     * @param {HTMLElement} object.parent
     * @param {Array} object.data
     * @param {Boolean} [object.force_video_outside] needs to be true if the video modal is not needed so the user can be redirected to YouTube
     * @returns {VanSlider}
     */
    constructor(object){
        this._interval = null;
        this._maxID = 0;
        this._ID = ClassHelper.getValue(object, "ID");
        this._title = ClassHelper.getValue(object, "title");
        this._time = ClassHelper.getValue(object, "time");
        this._parent = ClassHelper.getValue(object, "parent");
        this._data = ClassHelper.getArray(object, "data");


        this._force_video_outside = ClassHelper.getObject(object, "force_video_outside");


        return this;
    }


    update(data){
        let reference = this;

        this.data = data;
        this.maxID = 0;
        this.slides.html("");
        this.dots.html("");

        if(!ClassHelper.isEmpty(this.data))
            for (let i = 0; i < this.data.length; i++) {
                let slide = this.addSlide(this.data[i]);
                if (i === 0) slide.addClass("active");
            }

        this._init_navigation_dots();
    }

    /**
     *
     * @param object
     * @returns {HTMLElement}
     */
    addSlide(object){

        let reference = this;

        if(isEmpty(this.slides) || this.slides.length === 0){console.error("Missing slider parent element."); return null;}

        let ID = ++this.maxID;
        let print = '<div class="slide" data-id="'+ID+'"></div>';
        this.slides.append(print);
        let element = this.parent.find(".slide[data-id='"+ID+"']"); if(element.length === 0){console.error("Missing slider slide element."); return null;}


        if(ClassHelper.isDataSetInObject("type",object)){
            if (object["type"] === "image") {
                if(!ClassHelper.isDataSetInObject("url",object)){console.error("Missing slider url in object."); return null;}
                let content = '<img alt="Slide Image" src=""/>';
                element.append(content);
                element.find("> img").attr("src", object["url"]);
            }
            else if(object["type"] === "video") {
                if(!ClassHelper.isDataSetInObject("url",object)){console.error("Missing slider url in object."); return null;}
                let content =
                    '<img alt="Slide Image" src=""/>'+
                    '<div class="controls">' +
                    '<div class="play"><svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg></div>' +
                    '</div>';
                let results = object["url"].match('[\\?&]v=([^&#]*)');
                let videoID   = (results === null) ? object["url"] : results[1];
                element.append(content);
                element.find("> img").attr("src",'http://img.youtube.com/vi/' + videoID + '/0.jpg');

                element.find("> .controls > .play").unbind().on("click",function(){
                    if(!ClassHelper.isEmpty(reference.force_video_outside) && reference.force_video_outside){
                        window.open(object["url"], '_blank');
                    }
                    if( reference.modal_resize === null){
                        reference._init_navigation_expand();
                    }
                    reference.modal_resize.show();
                });


            }
            else console.error("Object type not compatible");
        }

        return element;

    }

    /**
     *
     * @returns {VanSlider}
     */
    init_slider(){
        let reference = this;

        if(isEmpty(this.parent) || this.parent.length === 0){console.error("Missing slider parent element."); return null;}
        if(!this.parent.hasClass("van-slider")) this.parent.addClass("van-slider");
        this.parent.attr("data-library","van");

        this.parent.append("<div class='slides'></div>");
        this.slides = this.parent.find("> .slides");

        setTimeout(()=>{reference.slides.addClass("initialized");},150);


        if(!ClassHelper.isEmpty(this.data)) {
            for (let i = 0; i < this.data.length; i++) {
                let slide = this.addSlide(this.data[i]);
                if (i === 0) slide.addClass("active");
            }
            if(this.data.length > 1) { this.interval = setInterval(()=>{reference._slide_automatically();},reference.time);}
        }



        return this;

    }

    /**
     *
     * @param {Array} type
     * @param {Boolean} strict - will judge if we allow arrows cases such as initial 1-item sliders
     * @returns {VanSlider}
     */
    init_navigation(type = ['arrows'], strict = true){

        if(isEmpty(this.parent) || this.parent.length === 0){console.error("Missing slider parent element."); return null;}

        if(type.includes("arrows")){
            if(strict){ if(this.data !== null && this.data.length > 1) this._init_navigation_arrows(); }
            else this._init_navigation_arrows();
        }

        if(type.includes("dots")){
            if(strict){ if(this.data !== null && this.data.length > 1) this._init_navigation_dots(); }
            else this._init_navigation_dots();
        }

        if(type.includes("expand")){
            this._init_navigation_expand();
        }



        return this;
    }



    _init_navigation_expand(){

        let reference =  this;

        try{

            this.modal_resize = new VanModal({
                ID : reference.ID,
                title : reference.title,
                type : 'full-screen',
                extra : 'slider-modal',
                content: '',
                callback_init : function(reference_modal){

                    reference_modal.parent.find("> .container")
                        .append(
                            '<div class="actionable">' +
                            '<div class="header"><div class="button external"><img alt="View External" src="image/icon/launch-white.svg"></div><div class="button close"><img alt="Close" src="image/icon/close-white.svg"></div></div>' +
                            '<div class="arrows">' +
                            '<div class="arrow left"><img alt="Arrow Left" src="image/icon/keyboard-arrow-left-white.svg"></div>' +
                            '<div class="arrow right"><img alt="Arrow Right" src="image/icon/keyboard-arrow-right-white.svg"></div>' +
                            '</div>' +
                            '<div class="dots"></div>' +
                            '</div>'
                        );

                    reference_modal.data.actionable_close =  reference_modal.parent.find("> .container > .actionable > .header > .button.close");
                    if(!ClassHelper.isEmpty(reference_modal.data.actionable_close)) reference_modal.data.actionable_close.unbind().on("click",()=>{reference_modal.close();});

                    reference_modal.data.actionable_external =  reference_modal.parent.find("> .container > .actionable > .header > .button.external");
                    if(!ClassHelper.isEmpty(reference_modal.data.actionable_external)) reference_modal.data.actionable_external.unbind().on("click",()=>{
                        let target = reference_modal.parent.find("> .container > .card > .content > .main");
                        let ID = parseInt(target.attr("data-element-id"));
                        let item = reference.data[ID - 1];
                        window.open(  (item["type"] === "image") ? item.full : item.url,"_blank");
                    });

                    reference_modal.data.actionable_arrow_left =  reference_modal.parent.find("> .container > .actionable > .arrows > .arrow.left");
                    reference_modal.data.actionable_arrow_right =  reference_modal.parent.find("> .container > .actionable > .arrows > .arrow.right");



                    let __slide_modal_item = function(nextID, target, reference, reference_modal){
                        let item =  reference.data[nextID - 1];
                        target.attr("data-element-id",nextID);

                        try{
                            let player = _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[reference.ID+"-player"];
                            if( player !== null && player !== undefined){
                                player.stopVideo();
                            }

                        }catch(e){
                            console.error(e);
                        }

                        target.fadeOut(250);
                        setTimeout(()=>{
                            if(item["type"] === "image") {
                                target.find(".player").hide();
                                target.find(".image").show();
                                target.find(".image > img").attr("src","");
                                target.find(".image > img").attr("src",item["full"]);
                            }
                            else if(item["type"] === "video"){
                                target.find("> .player").show();
                                target.find("> .image").hide();

                                let results = item["url"].match('[\\?&]v=([^&#]*)');
                                let videoID   = (results === null) ? item["url"] : results[1];


                                let player = _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[reference.ID+"-player"];

                                try{
                                    if( player !== null && player !== undefined){
                                        player.cueVideoById(videoID);
                                    }
                                }catch(e){
                                    console.error(e);
                                }


                            }

                            target.fadeIn(250);
                        },300);
                    };


                    if(!ClassHelper.isEmpty(reference_modal.data.actionable_arrow_left)){
                        reference_modal.data.actionable_arrow_left.unbind().on("click",()=>{
                            let target = reference_modal.parent.find("> .container > .card > .content > .main");
                            let ID = parseInt(target.attr("data-element-id"));
                            let nextID = (ID === null || ID <= 1) ? reference.maxID : (ID - 1);
                            __slide_modal_item(nextID, target, reference, reference_modal);
                        });
                    }

                    if(!ClassHelper.isEmpty(reference_modal.data.actionable_arrow_right)){
                        reference_modal.data.actionable_arrow_right.unbind().on("click",()=>{
                            let target = reference_modal.parent.find("> .container > .card > .content > .main");
                            let ID = parseInt(target.attr("data-element-id"));
                            let nextID = (ID === null || ID >= reference.maxID) ? 1 : (ID + 1);
                            __slide_modal_item(nextID, target, reference, reference_modal);
                        });
                    }






                    reference_modal.parent
                        .find("> .container > .card > .content")
                        .append(
                            '<div style="" class="main">' +
                            '<div style="" id="'+reference.ID+'-player" class="player"></div>'+
                            '<div class="image placeholder-image"><img  alt="Image" src="" ></div>' +
                            '</div>');

                    _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[reference.ID+"-player"] = {player: null};

                },
                callback_show : function(reference_modal){
                    let ID = parseInt(reference.slides.find(".slide.active").attr("data-id"));
                    let item = reference.data[ID - 1];
                    let target = reference_modal.parent.find("> .container > .card > .content > .main");
                    target.attr("data-element-id",ID);

                    if(item["type"] === "image") {
                        target.find(".player").hide();
                        target.find(".image").show();
                        target.find(".image > img").attr("src","");
                        ClassHelper.bindPicture(target.find(".image > img"),item["full"]);
                    }
                    else if(item["type"] === "video"){
                        target.find("> .player").show();
                        target.find("> .image").hide();

                        let results = item["url"].match('[\\?&]v=([^&#]*)');
                        let videoID   = (results === null) ? item["url"] : results[1];


                        let player = _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[reference.ID+"-player"];

                        try{
                            if( player !== null && player !== undefined){
                                player.cueVideoById(videoID);
                            }
                        }catch(e){
                            console.error(e);
                        }


                    }

                },
                callback_close : function(){
                    try{
                        let player = _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[reference.ID+"-player"];
                        if( player !== null && player !== undefined){
                            player.stopVideo();
                        }

                    }catch(e){
                        console.error(e);
                    }
                }
            }).init_modal();

        }
        catch (e) {
            console.error(e);
            return;
        }


        this.parent.append(
            '<div class="actions">' +
            '<div class="open"><svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M15.85 3.85L17.3 5.3l-2.18 2.16c-.39.39-.39 1.03 0 1.42.39.39 1.03.39 1.42 0L18.7 6.7l1.45 1.45c.31.31.85.09.85-.36V3.5c0-.28-.22-.5-.5-.5h-4.29c-.45 0-.67.54-.36.85zm-12 4.3L5.3 6.7l2.16 2.18c.39.39 1.03.39 1.42 0 .39-.39.39-1.03 0-1.42L6.7 5.3l1.45-1.45c.31-.31.09-.85-.36-.85H3.5c-.28 0-.5.22-.5.5v4.29c0 .45.54.67.85.36zm4.3 12L6.7 18.7l2.18-2.16c.39-.39.39-1.03 0-1.42-.39-.39-1.03-.39-1.42 0L5.3 17.3l-1.45-1.45c-.31-.31-.85-.09-.85.36v4.29c0 .28.22.5.5.5h4.29c.45 0 .67-.54.36-.85zm12-4.3L18.7 17.3l-2.16-2.18c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.03 0 1.42l2.18 2.16-1.45 1.45c-.31.31-.09.85.36.85h4.29c.28 0 .5-.22.5-.5v-4.29c0-.45-.54-.67-.85-.36z"/></svg></div>' +
            '</div>');

        this.actions = this.parent.find(".actions");
        this.actions.find(".open").unbind().on("click",function(){
            reference.modal_resize.show();
        });
    }



    _init_navigation_dots(){
        let reference = this;
        if((this.parent.find(".dots")).length > 0) this.parent.find(".dots").remove();

        this.parent.append("<div class='dots'></div>");
        this.dots = this.parent.find(" > .dots");
        if(!ClassHelper.isEmpty(this.data)) {
            for (let i = 0; i < this.data.length; i++) {
                this.dots.append("<div data-id='" + (i + 1) + "' class='dot'></div>");
            }
            if(this.data.length > 0) this.dots.find(".dot[data-id=1]").addClass("active");
            if(this.data.length > 1) this.dots.find(".dot").on("click",function(){reference._slide_specifically($(this).attr("data-id"))});
        }

    }

    _init_navigation_arrows(){
        let reference = this;

        this.parent.append("<div class='arrows'></div>");
        this.arrows = this.parent.find(" > .arrows");

        this.arrows.append('<div class="arrow left"><svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"/></svg></div>');
        this.arrows.append('<div class="arrow right"><svg fill="#ffffff"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"/></svg></div>');

        let arrow_left = this.arrows.find(" > .arrow.left");
        let arrow_right = this.arrows.find(" > .arrow.right");

        arrow_left.unbind().on("click",function(){
            let arrow = $(this);
            arrow.addClass("disabled");
            setTimeout(()=>{arrow.removeClass("disabled");},200);
            reference._slide_directionally("left");
        });
        arrow_right.unbind().on("click",function(){
            let arrow = $(this);
            arrow.addClass("disabled");
            setTimeout(()=>{arrow.removeClass("disabled");},200);
            reference._slide_directionally("right");
        });
    }


    _slide_directionally(direction = "right"){
        let reference = this;
        clearInterval(this.interval);

        let current = this.slides.find(".slide.active");
        let currentID = parseInt(current.attr("data-id"));

        let next = null;
        let nextID = null;

        if(direction === "right"){
            nextID = currentID + 1;
            next = this.slides.find(".slide[data-id='"+nextID+"']");
            if(next.length === 0) {
                nextID = 1;
                next = this.slides.find(".slide[data-id='1']");
            }
        }
        else{
            nextID = currentID - 1;
            next = this.slides.find(".slide[data-id='"+nextID+"']");
            if(next.length === 0)  {
                nextID = this.maxID;
                next = this.slides.find(".slide[data-id='"+this.maxID+"']");
            }
        }


        next.addClass("active");

        setTimeout(() => {
            current.removeClass("active");
            reference.interval = setInterval(()=>{reference._slide_automatically();},reference.time);
        }, 200);


        if(this.dots !== null){
            this.dots.find(".dot[data-id='"+nextID+"']").addClass("active");
            this.dots.find(".dot[data-id='"+currentID+"']").removeClass("active");
        }

    }

    _slide_specifically(ID){
        let reference = this;
        let element = this.dots.find("dot[data-id='"+ID+"']");
        if(!element.hasClass("active")) {
            clearInterval(this.interval);
            this.dots.find(".dot").removeClass("active");
            element.addClass("active");

            let slide = (this.slides.find(".slide[data-id='" + ID + "']"));
            if (!slide.hasClass("active")) {
                let current = this.slides.find(".slide.active");
                let current_dot = this.dots.find(".dot.active");
                slide.addClass("active");
                this.dots.find(".dot[data-id='"+ID+"']").addClass("active");

                setTimeout(() => {
                    current.removeClass("active");
                    current_dot.removeClass("active");
                }, 200);

            }
            this.interval = setInterval(()=>{reference._slide_automatically();},reference.time);
        }else{
            clearInterval(this.interval);
            this.interval = setInterval(()=>{reference._slide_automatically();},reference.time);
        }

    }

    _slide_automatically(){
        if(this.time === null || isEmpty(this.time)){return; } //This is now a static slider, without the "auto slide show" enabled

        if (this.parent.find(".arrow:hover").length !== 0 ||
            this.parent.find(".dots:hover").length !== 0 ||
            this.parent.find(".controls .play:hover").length !== 0) {
            console.log("Controls in use.");
            return; //Controls are used, so don't mess with the UI while this is happening
        }

        let current = this.slides.find(".slide.active");
        let currentID = parseInt(current.attr("data-id"));
        let next = this.slides.find(".slide[data-id='"+((currentID + 1))+"']"); if(next.length === 0)  next = this.slides.find(".slide[data-id='1']");
        let nextID = parseInt(next.attr("data-id"));

        next.addClass("active");
        setTimeout(() => {
            current.removeClass("active");
        }, 200);

        if(this.dots !== null){
            this.dots.find(".dot[data-id='"+nextID+"']").addClass("active");
            this.dots.find(".dot[data-id='"+currentID+"']").removeClass("active");
        }




    }


    ___modal_callback_show_item(){

    }



    static __init_slider_modal_videos() {


        window.youtubeScript = document.getElementById('youtube-api');

        if (window.youtubeScript === null) {
            let tag = document.createElement('script');
            let firstScript = document.getElementsByTagName('script')[0];

            tag.src = 'https://www.youtube.com/iframe_api';
            tag.id = 'youtube-api';
            firstScript.parentNode.insertBefore(tag, firstScript);
        }

        window.onYouTubeIframeAPIReady = function () {
            for (let playerID in _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS) {
                if (_VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS.hasOwnProperty(playerID)) {
                    _VAN_SLIDER_GLOBAL_YOUTUBE_VIDEOS[playerID] =
                        new window.YT.Player(playerID, {videoId: "", playerVars: {modestbranding: 1, rel: 0}});
                }
            }
        }
    }
}