<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.params.id }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Widgetry</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong class="capitalize">{{ $route.params.id }}</strong>
        <p>Is this the home page? </p>
      </div>
      <div v-if="!isUserLoggedIn">logged in</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isUserLoggedIn = ref(false);

import { Preferences } from '@capacitor/preferences';

const url = import.meta.env.VITE_WIDGETRY_URL;

onMounted(async () => {
  const t = await Preferences.get({ key: 'IS_USER_LOGGED_IN' });

  if (t.value !== null) {
    isUserLoggedIn.value = (t.value === 'true');
  }

  console.log(isUserLoggedIn.value);
  //if we are not logged in redirect to the login page
  if(!isUserLoggedIn.value){
    router.push('/login');
  }
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
