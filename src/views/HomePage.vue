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
      <ion-card v-for="widget in widgets" class="widget-card" :data-widgetid="widget.widgetID" :data-widgettitle="widget.widgetInfo.description">
        <ion-card-title>{{ widget.widgetInfo.description }}</ion-card-title>
        <ion-card-content @click="openModal">
          <ul class="squares" style="overflow-x: scroll;">
            <li v-for="(item, index) in widget.widgetDataPoints" class="datapoint" :data-dataid="index"
              :style="{ backgroundColor: widget.widgetInfo.color, opacity: item.opacity }">
            </li>
          </ul>
        </ion-card-content>
      </ion-card>

      <ion-modal ref="modal" :is-open="isModalOpen"  :initial-breakpoint="0.25" @willDismiss="onDidDismiss($event)" >
        <ion-content>
          <ion-toolbar>
            <ion-title>{{modalTitle}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-list>
            <ion-item>
              <ion-avatar slot="start">
                <ion-img src="https://i.pravatar.cc/300?u=b"></ion-img>
              </ion-avatar>
              <ion-label>
                <h2>Connor Smith</h2>
                <p>Sales Rep</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-avatar slot="start">
                <ion-img src="https://i.pravatar.cc/300?u=a"></ion-img>
              </ion-avatar>
              <ion-label>
                <h2>Daniel Smith</h2>
                <p>Product Designer</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-avatar slot="start">
                <ion-img src="https://i.pravatar.cc/300?u=d"></ion-img>
              </ion-avatar>
              <ion-label>
                <h2>Greg Smith</h2>
                <p>Director of Operations</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-avatar slot="start">
                <ion-img src="https://i.pravatar.cc/300?u=e"></ion-img>
              </ion-avatar>
              <ion-label>
                <h2>Zoey Smith</h2>
                <p>CEO</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  createAnimation,
  IonImg,
  IonAvatar,
  IonLabel,
  IonItem,
  IonList,
  IonModal
} from '@ionic/vue';
import { watch, onBeforeUpdate, ref } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '@/state';
import { Preferences } from '@capacitor/preferences';
import { WidgetryTools } from '@/helpers/WidgetryTools';
import WidgetBuilder from '@/helpers/WidgetBuilder';

//Our array of widgets to display
const widgets = ref();
const router = useRouter();
const min = ref(0);
const max = ref(1);
//const store = new Storage();


const url = import.meta.env.VITE_WIDGETRY_URL;

/**
 * MODAL STUFF
 */

const modal = ref();

const isModalOpen = ref(false);

const dismiss = () => modal.value.$el.dismiss();

const modalTitle = ref("");
const setOpen = (open: boolean) => (isModalOpen.value = open);
function openModal(e: { target: { closest: (arg0: string) => { (): any; new(): any; dataset: { (): any; new(): any; widgetid: any; widgettitle: any; }; }; }; }) {
  console.log(e);

  //get the widgetID & titlefrom the parent
  let id = e.target.closest(".widget-card").dataset.widgetid;
  let title = e.target.closest(".widget-card").dataset.widgettitle;

  modalTitle.value = title;

  console.log(id + title);
  isModalOpen.value = true;
}

function onDidDismiss(event: any){

  console.log(event);
  isModalOpen.value = false;

};

/**
 * END MODAL STUFF
 */

 watch( () => state.isLoading,
 (isLoading) => {
    console.log('isloading changed' + isLoading)
      WidgetBuilder.loadAllWidgetsFromStorage()
      .then(data => {
        console.log('back')

        widgets.value = data;
        console.log('added');
        console.log(data);

      });
 }

 )
onBeforeUpdate(async () => {

  //const test = await storage.get('test');
  //await storage.set("my-key", "junki")

  //lets get the widgets from state
  //TODO if no widget found then kick off sync

  //Load the widgets from storage
  console.log('loading in Homepage' + state.isLoading)
  if(state.isLoading){
    console.log('no cos still loading');
    return;
  }
  WidgetBuilder.loadAllWidgetsFromStorage()
    .then(data =>{
      console.log('back')

      widgets.value = data;
      console.log('added');
      console.log(data);

    });
})

</script>

<style scoped>
.squares {
  grid-area: squares;
}

.squares {
  display: grid;
  grid-gap: 5px;
  grid-template-rows: repeat(7, 15px);
}

.squares {
  grid-auto-flow: column;
  grid-auto-columns: 15px;
}

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
