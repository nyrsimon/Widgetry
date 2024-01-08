<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>Sync Widgets</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Widgetry</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="m-2">
                <div class="flex justify-center ">
                    <img :src="logo" class="max-h-16 max-w-16">
                </div>
                <div class="mt-5 flex flex-row justify-center h-14">
                    <button @click="syncClicked" class="px-2 outline-gray-400 text-2xl bg-blue-300">Sync</button>
                </div>
                        <div v-if="isMessage" class="mt-5  text-2xl p-2 bg-red-300 text-center ">
              <p>{{ message }}</p>
            </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, loadingController, } from '@ionic/vue';
//import { mailOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '../assets/widgetry-logo.png';
import axios from 'axios';
import { Browser } from '@capacitor/browser';
import { state } from '@/state';
import { Preferences } from '@capacitor/preferences';
import { WidgetryTools } from '@/helpers/WidgetryTools';

const router = useRouter();

const isUserLoggedIn = ref(false);

import { mailOutline } from 'ionicons/icons';

const url = import.meta.env.VITE_WIDGETRY_URL;

const form = {
    "email": "",
    "password": ""

}

const isMessage = ref(false);
const message = ref("");
function syncClicked() {
    console.log('Sync clicked');

    syncWidgets();
}

const syncWidgets = async () => {

    //Turn off the error
    isMessage.value = false;


    const url = import.meta.env.VITE_WIDGETRY_URL;
    const token = await WidgetryTools.getTokenFromStorage();
    console.log('token' + token);

    const options = {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token

        }
    }

    axios.get(url + '/api/syncWidgetsForUser', options)
        .then(async response => {
            console.log(response);
            if (response.status == 200) {
                //good response - just display a message
                message.value = "Sync Requested";
                isMessage.value = true;
            }
        })
        .catch(function (error) {
            console.log('axios error');
            console.log(error.response.data.message);
            isMessage.value = true;
            message.value = "There was a problem syncing, please try again";

        })
        .finally(() => {
        })
}

</script>

<style scoped>
#container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

#container strong {
    font-size: 20px;
    line-height: 26px;
}

#container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
}

#container a {
    text-decoration: none;
}
</style>
