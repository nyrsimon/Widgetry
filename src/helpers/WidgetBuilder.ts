// This is the Widget Builder Class
import storage from '../storage';

class WidgetBuilder {

    //Prefix used for the key inthe local storage
    widgtePrefix= "Widget-";

    widgetData = {
        widgetID: null,
        widgetDataPoints:[]
    };

    constructor() {
        this.widgetData.widgetDataPoints = [];
    }

    //Loads the data for a specific widget ID from the Storage (SQLlite)
    //Returns true for success or false for failure
    async loadData(widgetID: BigInt){
        let key = this.widgtePrefix + widgetID;

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

    //This adds a data point
    addData(date: string, value: number, isDirty: boolean){

        this.widgetData.widgetDataPoints.push(date, value, isDirty);

        //Returnt his soe we can chain
        return this;
    }

    build(){
        return this.widgetData
    }
}