import { Preferences } from '@capacitor/preferences';
import axios from 'axios';
//import { storage } from '@/storage';
import WidgetBuilder from '@/helpers/WidgetBuilder';
import { state } from '@/state';
import { DataPoint } from '@/helpers/WidgetInterface';

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
                console.log('resp');

                console.log(response);
                if (response.status == 200) {

                    await WidgetBuilder.clearStorage();

                    //OK let's store all this in the Internal Storage
                    response.data.forEach(async (widget: any) => {
                        //create a widget
                        let w = new WidgetBuilder(widget.id);

                        w.importAPIData(widget)

                        //save it to Storage
                        await w.saveToStorage();

                        console.log('saving');
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
        console.log('get tok from storage');
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

    /**
     * Saves a datapaoint for  a widget to Widgetry & Notion
     * @param dp
     */
    static async saveDatapoint(dp : DataPoint, widgetID: Number){
        console.log('Save DP');
        console.log(dp);
        const token = await this.getTokenFromStorage();
        console.log('token' + token);

        //now lets build the headers
        const options = {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        }

        //Convert datapoint to plan  object
        let data = JSON.parse(JSON.stringify(dp));

        //Add in the widget id
        data.widgetID = widgetID

        axios.post('http://localhost/api/saveDatapoint', data, options)
            .then(async response => {
                console.log('Save resp');

                console.log(response);
                if (response.status == 200) {

                    // await WidgetBuilder.clearStorage();

                    // //OK let's store all this in the Internal Storage
                    // response.data.forEach(async (widget: any) => {
                    //     //create a widget
                    //     let w = new WidgetBuilder(widget.id);

                    //     w.importAPIData(widget)

                    //     //save it to Storage
                    //     await w.saveToStorage();

                        console.log('Saved');
                        // console.log(w.widgetData);
                    //});
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
            .finally(() => {
                console.log('finally');
                //state.isLoading = false;
            })


    }
}