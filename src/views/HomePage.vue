<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title style="color:black;">Widgetry</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-title>Some title here</ion-card-title>
        <ion-card-content>
          Contnt goes here
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '@/state';
import storage from '@/storage';
import { Preferences } from '@capacitor/preferences';
import NotionTools from '@/'
//Our array of widgets to display
const widgets = [];
const router = useRouter();
//const store = new Storage();


const url = import.meta.env.VITE_WIDGETRY_URL;

onMounted(async () => {

  //const test = await storage.get('test');
  //await storage.set("my-key", "junki")

  const isUserLoggedIn = await Preferences.get({ key: 'IS_USER_LOGGED_IN' });

  const token = await Preferences.get({ key: "WIDGETRY_TOKEN" });

  console.log(isUserLoggedIn);

  //if we are not logged in redirect to the login page
  if (!isUserLoggedIn.value) {
    router.push('/login');
  }

  //store token in state
  state.token = token.value || "";
})

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
