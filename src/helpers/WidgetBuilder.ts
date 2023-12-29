// This is the Widget Builder Class
import { key } from 'localforage-cordovasqlitedriver';
import storage from '../storage';

export default class WidgetBuilder {

    //Prefix used for the key inthe local storage
    static widgetPrefix= "Widget-";

    widgetData = {
        widgetID: <BigInt | null> null,
        widgetDataPoints: <any> []
    };

    constructor(id: BigInt) {
        this.widgetData.widgetID = id;
        this.widgetData.widgetDataPoints = [];
    }

    //loads all the widgets - returns an array of widgets
    static async loadAllWidgetsFromStorage(){
        let widgets: any[] = [];

        await storage.forEach((value, key: string,  index) => {
            if (key.startsWith(this.widgetPrefix)) {
                widgets.push(value)
            }
        });

        console.log('ret');
        console.log(widgets);
        return widgets;

    }
    //Loads the data for a specific widget ID from the Storage (SQLlite)
    //Returns true for success or false for failure
    async loadDataFromStorage(widgetID: BigInt){
        let key = WidgetBuilder.widgetPrefix + widgetID;

        //now get it from storage
        const data = await storage.get(key);

        console.log(data);

        //Did we get anything?
        if(data === null){
            //TODO should we do something hete
            return false;
        }

        //let's store the data
        this.widgetData = data;

        return true;
    }

    //imports the data that we get from the api
    importAPIData(data : Array<any>){
        //loop through the data and lod it up
        data.forEach(element => {
            this.addData(element.record_date, element.data_value, false);
        });
        return true;
    }

    //Saves this in the App Storage
    saveToStorage(){
        storage.set( WidgetBuilder.widgetPrefix + this.widgetData.widgetID, this.widgetData)
    }

    //Clears the storage of all widgets
    static clearStorage(){
        storage.forEach((value, key, index) => {
            if (key.startsWith(this.widgetPrefix)) {
                storage.remove(key);
            }
        });

    }
    //This adds a data point
    addData(date: string, value: number, isDirty: boolean){

        this.widgetData.widgetDataPoints.push({date, value, isDirty});

        //Returnt his soe we can chain
        return this;
    }

    build(){
        return this.widgetData
    }
}
