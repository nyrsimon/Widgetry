import { Preferences } from '@capacitor/preferences';
import axios from 'axios';
//import { storage } from '@/storage';
import WidgetBuilder from '@/helpers/WidgetBuilder';
import { state } from '@/state';

export class WidgetryTools {

    static TOKEN_KEY = "WIDGETRY_TOKEN";

    //This will sync the widgets - for now just load em up!
    //We expect the token to be in held in our state object
    static async syncWidgets() {
        console.log('sync');
        state.isLoading = true;
        const token = await this.getTokenFromStorage();
        console.log('token' + token);

        //now lets get the widgets
        const options = {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }
        axios.get('http://localhost/api/widgets', options)
            .then(async response => {
                console.log(response);
                if (response.status == 200) {

                    console.log('resp');
                    console.log(response);
                    WidgetBuilder.clearStorage();

                    //OK let's store all this in the Internal Storage
                    response.data.forEach((widget: any) => {
                        //create a widget
                        let w = new WidgetBuilder(widget.id);

                        w.importAPIData(widget)

                        //save it to Storage
                        w.saveToStorage();

                        console.log('saveing');
                        console.log(w.widgetData);
                    });
                    //good response - store the token, update the preferences and redirect to dashboard
                    //await Preferences.set({ key: 'IS_USER_LOGGED_IN', value: "YES" });
                    //await Preferences.set({ key: 'WIDGETRY_TOKEN', value: response.data.token });

                    //state.token = response.data.token;
                    //storeTokenInPreferences(response.data.token);
                    //Redirect
                    //router.push('/')
                }
            })
            .catch(function (error) {
                console.log('axios error');
                console.log(error.response.data.message);

            })
            .finally( () => {
                state.isLoading = false;
            })

    }

    static async getTokenFromStorage(): Promise<string> {

        //Get the Widgetry Access token
        const token = await Preferences.get({ key: this.TOKEN_KEY });

        console.log(token);
        if (token === null) {
            return "";
        }

        return token.value || "";
    }

    static async saveTokenToStorage(token: string): Promise<string> {

        //Get the Widgetry Access token
        await Preferences.set({ key: this.TOKEN_KEY, value: token });
        return "";
    }

}