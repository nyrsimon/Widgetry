<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
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
        <div
          class="mt-5 flex flex-row bg-gray-200 h-14 align-middle border-b-2 border-solid border-gray-500 focus-within:border-blue-500">
          <!-- <ion-icon :icon="mailOutline" size="large" color="primary" class="bg-gray-200"></ion-icon> -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-8 h-8 mt-2 mr-3 ml-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
          </svg>

          <input type="email" v-model="form.email" placeholder="Email Address"
            class="text-2xl bg-gray-200 focus:outline-none">
        </div>
        <div
          class="mt-5 flex flex-row bg-gray-200 h-14 align-middle border-b-2 border-solid border-gray-500  focus-within:border-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-8 h-8 mt-2 mr-3 ml-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <input type="password" v-model="form.password" placeholder="Password"
            class="text-2xl bg-gray-200 focus:outline-none">
        </div>
        <div v-if="isError">
          <p>{{  errorMessage }}</p>
        </div>
        <div class="mt-5 flex flex-row justify-center h-14">
          <button @click="loginClicked" class="px-2 outline-gray-400 text-2xl bg-blue-300">Login</button>
        </div>
        <div class="mt-5 flex flex-row">
          <p class="mr-2">Don't have an account?</p><a @click="signupClicked">Sign Up</a>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
//import { mailOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '../assets/widgetry-logo.png';
import axios from 'axios';
import { Browser } from '@capacitor/browser';
import { state } from '@/state';
import { Preferences } from '@capacitor/preferences';

const router = useRouter();

const isUserLoggedIn = ref(false);

import { mailOutline } from 'ionicons/icons';

const url = import.meta.env.VITE_WIDGETRY_URL;

const form = {
  "email": "",
  "password": ""

}

const isError = ref(false);
const errorMessage = ref("");
function loginClicked() {
  console.log('clicked');

  logon(form.email, form.password);
}

const logon = async (id: any, pwd: any) => {

  //await Browser.open({ url: 'http://widgetry.io/' });

  const options = {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Access-Control-Allow-Origin" : "*",
      "Content-Type" : "application/json"
    }
  }

  const data = {
    "email" : id,
    "password" : pwd
  }
  axios.post('http://localhost/api/createToken', data, options)
    .then(response => {
      console.log(response);
      if(response.status == 200){
        //good response - store the token and redirect to dashboard
        state.token = response.data.token;
        storeTokenInPreferences(response.data.token);
        //Redirect
        router.push('/')
      }
    })
    .catch(function (error){
      console.log('axios error');
      console.log(error.response.data.message);

    })
}

async function storeTokenInPreferences(token: string){
  await Preferences.set({
    key: "NOTION_TOKEN",
    value: token
  })
}
async function signupClicked(e: { stopPropagation: () => void; }) {
  console.log('sign');
  e.stopPropagation();
  await Browser.open({ url: 'http://app.widgetry.io/register' });

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
