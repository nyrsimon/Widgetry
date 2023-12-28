import { Preferences } from '@capacitor/preferences';

class WidgetryTools {

    //This will sync the widgets - for now just load em up!
    static syncWidgets() {

        const token = this.getTokenFromStorage();


    }

    static getTokenFromStorage(){

        //Get the Widgetry Access token
        const token = Preferences.get({ key: "WIDGETRY_TOKEN" });

        if(token === null) {
            return false;
        }

        return token;
    }
}