// This is the Widget Builder Class
import { key } from 'localforage-cordovasqlitedriver';
import storage from '../storage';
import { Widget } from '@/helpers/WidgetInterface';

export default class WidgetBuilder {

    //Prefix used for the key inthe local storage
    static widgetPrefix = "Widget-";

    widgetData : Widget = {
        widgetID : 0,
        widgetDataPoints : [],
        widgetInfo : {
            description: "",
            color: ""
        }

    };

    // widgetData = {
    //     widgetID: <BigInt | null>null,
    //     widgetDataPoints: <any>[],
    //     widgetInfo: <any>[]
    // };

    constructor(id: Number) {
        this.widgetData.widgetID = id;
        this.widgetData.widgetDataPoints = [];
    }

    //loads all the widgets - returns an array of widgets
    static  loadAllWidgetsFromStorage =  ()  => {
        return new Promise(async resolve => {
            let widgets: Widget[] = [];

            await storage.forEach((value, key: string, index) => {
                if (key.startsWith(this.widgetPrefix)) {
                    widgets.push(value)
                }
            });

            console.log('returned from storage');
            console.log(widgets);
            resolve(widgets);

        })

    }
    //Loads the data for a specific widget ID from the Storage (SQLlite)
    //Returns true for success or false for failure
    async loadDataFromStorage(widgetID: BigInt) {
        let key = WidgetBuilder.widgetPrefix + widgetID;

        //now get it from storage
        const data = await storage.get(key);

        console.log(data);

        //Did we get anything?
        if (data === null) {
            //TODO should we do something hete
            return false;
        }

        //let's store the data
        this.widgetData = data;

        return true;
    }

    //imports the data that we get from the api
    //We are give the data returned from the API for ONE widget
    importAPIData(data: { [x: string]: any; datapoints?: any[] | undefined; }) {

        //now add the opacity stuff
        //Find min/max values for opacity for each widget
        let min = 0;
        let max = 1;
        data.datapoints?.forEach(dp => {
        //for (let dp of data.datapoints) {
            if (Number(dp.data_value) > max) {
                max = Number(dp.data_value);
            }
        });


        //Now loop through again and calc the opacity :)
        let delta = max - min;

        for (let j = 0; j < data.datapoints!.length; j++) {
            let dp = data.datapoints![j];
            let diff = dp.data_value - min;
            let opacity = diff / delta;
            opacity = Math.round(opacity * 100) / 100;
            //now get in the range 0.2 to 1
            opacity = opacity * .8;
            opacity = opacity + .2;
            opacity = Math.round(opacity * 100) / 100;
            data.datapoints![j].opacity = opacity;
        }


        //loop through the datapoints and load them up into this object
        data.datapoints?.forEach(element => {
            this.addData(element.record_date, element.data_value, element.opacity, false);

        });

        //remove the datapoints from the input
        delete data['datapoints'];

        //And the info stuff
        this.widgetData.widgetInfo.description = data.description;
        this.widgetData.widgetInfo.color = data.color;
        //Ok store min/mox
        //this.widgetData.widgetInfo.min = min;
        //this.widgetData.widgetInfo.max = max;


        return true;
    }

    //Saves this in the App Storage
    async saveToStorage() {
        storage.set(WidgetBuilder.widgetPrefix + this.widgetData.widgetID, this.widgetData)
    }

    //Clears the storage of all widgets
    static async clearStorage() {
        console.log('starting to clear');
        storage.forEach(async (value, key, index) => {
            if (key.startsWith(this.widgetPrefix)) {
                await storage.remove(key);
            }
        });
        console.log ('clear done');

    }
    //This adds a data point
    addData(datex: string, value: number, opacity: number, isDirty: boolean) {

        this.widgetData.widgetDataPoints.push({
            record_date: datex,
            value: value,
            opacity: opacity,
            isDirty: isDirty
        });

        //Returnt his soe we can chain
        return this;
    }

    build() {
        return this.widgetData
    }
}
