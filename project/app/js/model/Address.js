import {ClassHelper} from "./../../base/util.js";

/**
 * Created by @VanSoftware on 2019-06-09.
 */


class Address{
    get ID() {
        return this._ID;
    }

    set ID(value) {
        this._ID = value;
    }

    get AID() {
        return this._AID;
    }

    set AID(value) {
        this._AID = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }

    get county() {
        return this._county;
    }

    set county(value) {
        this._county = value;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    get street() {
        return this._street;
    }

    set street(value) {
        this._street = value;
    }

    get streetNumber() {
        return this._streetNumber;
    }

    set streetNumber(value) {
        this._streetNumber = value;
    }

    get building() {
        return this._building;
    }

    set building(value) {
        this._building = value;
    }

    get buildingEntrance() {
        return this._buildingEntrance;
    }

    set buildingEntrance(value) {
        this._buildingEntrance = value;
    }

    get floor() {
        return this._floor;
    }

    set floor(value) {
        this._floor = value;
    }

    get apartment() {
        return this._apartment;
    }

    set apartment(value) {
        this._apartment = value;
    }

    get postcode() {
        return this._postcode;
    }

    set postcode(value) {
        this._postcode = value;
    }

    get latitude() {
        return this._latitude;
    }

    set latitude(value) {
        this._latitude = value;
    }

    get longitude() {
        return this._longitude;
    }

    set longitude(value) {
        this._longitude = value;
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

        this.AID = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_AID);
        this.country = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_COUNTRY);
        this.county = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_COUNTY);
        this.city=  ClassHelper.getValue(object, MODEL_ADDRESS_KEY_CITY);
        this.street = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_STREET);
        this.streetNumber = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_STREET_NUMBER);
        this.building = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_BUILDING);
        this.buildingEntrance = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_BUILDING_ENTRANCE);
        this.floor = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_FLOOR);
        this.apartment=  ClassHelper.getValue(object, MODEL_ADDRESS_KEY_APARTMENT);
        this.postcode = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_POSTCODE);
        this.latitude = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_LATITUDE);
        this.longitude = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_LONGITUDE);
        this.createdAt = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_CREATED_AT);
        this.updatedAt = ClassHelper.getValue(object, MODEL_ADDRESS_KEY_UPDATED_AT);

    }

    toString(short = false){

        let address = "";

        let comma = () => {return address.length !== 0 ? ", " : ""};


        if(!short) address += (!ClassHelper.isEmpty(this.country)) ? (comma() +   this.country ) : "";
        if(!short)  address += (!ClassHelper.isEmpty(this.county)) ? (comma() +   this.county ) : "";
        address += (!ClassHelper.isEmpty(this.city)) ? (comma() +   this.city ) : "";
        address += (!ClassHelper.isEmpty(this.street)) ? (comma()+   this.street ) : "";
        if(!short)  address += (!ClassHelper.isEmpty(this.streetNumber)) ? (comma()+   this.streetNumber ) : "";
        if(!short)  address += (!ClassHelper.isEmpty(this.building)) ? (comma() + "Building " + this.building ) : "";
        if(!short)  address += (!ClassHelper.isEmpty(this.buildingEntrance)) ? (comma() +   this.buildingEntrance ) : "";
        if(!short)  address += (!ClassHelper.isEmpty(this.floor)) ? (comma() +  "Fl. " + this.floor ) : "";
        if(!short) address += (!ClassHelper.isEmpty(this.apartment)) ? (comma() + "Ap. " +   this.apartment ) : "";
        address += (!ClassHelper.isEmpty(this.postcode)) ? (comma()+   this.postcode ) : "";
        if(!short) address += (!ClassHelper.isEmpty(this.longitude)) ? (comma() + "Lng. " +   this.longitude ) : "";
        if(!short) address += (!ClassHelper.isEmpty(this.latitude)) ? (comma()+  "Lat. " + this.latitude ) : "";

        return !short ?  "Address: "+address : address;
    }

}

export default Address;