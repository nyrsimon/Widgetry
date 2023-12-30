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
      <ion-card v-for="widget in widgets">
        <ion-card-title>{{ widget.widgetInfo.description }}</ion-card-title>
        <ion-card-content>
          <ul class="squares" style="overflow-x: scroll;">
            <li v-for="(item, index) in widget.widgetDataPoints" class="datapoint" :id="index"
              :style="{ backgroundColor: widget.widgetInfo.color, opacity:  item.opacity }" >
            </li>
          </ul>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import { nextTick, onMounted, ref } from 'vue';
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

onMounted(async () => {

  //const test = await storage.get('test');
  //await storage.set("my-key", "junki")

  await WidgetryTools.syncWidgets();

  //Load the widgets from storage
  let ret = await WidgetBuilder.loadAllWidgetsFromStorage();

  console.log('in mount');
  console.log(ret);

  //Find min/max values for opacity for each widget
  for (let i =0; i< ret.length; i++) {
    let widget = ret[i];
    let min = 0;
    let max = 1;
    for (let dp of widget.widgetDataPoints){
      if(Number(dp.value) > max){
        max = Number(dp.value);
      }
    }

    //Ok store min/mox
    ret[i].widgetInfo.min = min;
    ret[i].widgetInfo.max = max;
  }

  //Now loop through again and calc the opacity :)
  for (let i = 0; i < ret.length; i++) {
    let widget = ret[i];
    let delta = widget.widgetInfo.max - widget.widgetInfo.min;
    let min = widget.widgetInfo.min;

    for (let j=0; j<widget.widgetDataPoints.length; j++) {
      let dp = widget.widgetDataPoints[j];
      let diff = dp.value - min;
      let opacity = diff / delta;
      opacity = Math.round(opacity * 100) / 100;
      //now get in the range 0.2 to 1
      opacity = opacity * .8;
      opacity = opacity + .2;
      opacity = Math.round(opacity * 100) / 100;
      ret[i].widgetDataPoints[j].opacity = opacity;
    }

  }

  widgets.value = ret;
  console.log('added');
  console.log(ret);
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
