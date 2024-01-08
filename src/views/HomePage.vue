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
      <ion-card v-for="(widget, index) in widgets" class="widget-card" :data-widgetid="index"
        :data-widgettitle="widget.widgetInfo.description">
        <ion-card-title>{{ widget.widgetInfo.description }}</ion-card-title>
        <ion-card-content @click="openModal">
          <ul class="squares" style="overflow-x: scroll;">
            <li v-for="(item, index) in widget.widgetDataPoints" class="datapoint" :data-dataid="index"
              :style="{ backgroundColor: widget.widgetInfo.color, opacity: item.opacity }">
            </li>
          </ul>
        </ion-card-content>
      </ion-card>

      <ion-modal ref="modal" :is-open="isModalOpen" :initial-breakpoint="0.25" @willDismiss="onDidDismiss($event)">
        <ion-content>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="setOpen(false)">Cancel</ion-button>
            </ion-buttons>
            <ion-title>{{ modalTitle }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="savePressed($event)">Save</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-list>
            <ion-item>
              <ion-icon aria-hidden="true" :icon="calendarNumberOutline" slot="start"></ion-icon>
              <ion-datetime-button datetime="datetime"></ion-datetime-button>
            </ion-item>
            <ion-item>
              <ion-icon aria-hidden="true" :icon="createOutline" slot="start"></ion-icon>
              <ion-input  type="number" v-model="metricValue"></ion-input>
              <!-- <ion-datetime presentation="date" size="cover" @ionChange="dateChanged($event)"
                :max="maxDate"></ion-datetime> -->
              <ion-modal :keep-contents-mounted="true">
                <ion-datetime id="datetime" size="cover" presentation="date" :value="currDate.toISOString()" :max="maxDate" :show-default-buttons="true" @ionChange="dateChanged($event)"></ion-datetime>
              </ion-modal>
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
  IonInput,
  IonCard,
  IonCardContent,
  IonDatetime,
  IonDatetimeButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  createAnimation,
  IonImg,
  IonAvatar,
  IonLabel,
  IonItem,
  IonList,
  IonModal,
  IonIcon
} from '@ionic/vue';
import { watch, onBeforeUpdate, ref, reactive, ReactiveEffect } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '@/state';
import { Preferences } from '@capacitor/preferences';
import { WidgetryTools } from '@/helpers/WidgetryTools';
import WidgetBuilder from '@/helpers/WidgetBuilder';
import { calendarNumberOutline, createOutline } from 'ionicons/icons';
import {DataPoint, Widget} from '@/helpers/WidgetInterface';

//This is the main Widget array
const widgets = ref<Widget[]>([]);
const router = useRouter();

const metricValue = ref(0);
const currDate = ref(new Date());
const maxDate = new Date().toISOString();
const widgetBeingEdited = ref(0);

/**
 * When the date changes load the new value
 * @param e
 */
function dateChanged(e: any) {
  console.log('changed');
  console.log(e);

  //Get the new date selected and save it
  let d = new Date(e.detail.value);
  currDate.value = d;
  console.log(currDate.value.toISOString());

  //need to find the datapoint with the date we have selected!
  let val = findMetricValInWidgetForDate(widgetBeingEdited.value, currDate.value);

  metricValue.value = val;

}

/**
 * Finds the metric for a date - if no date found returns zero
 * @param widgetID
 * @param dateToFind
 */
function findMetricValInWidgetForDate(widgetID : number, dateToFind : Date){

  //Get the datapoints for this widget
  let dps = widgets.value[widgetID];

  //get the date in YYYY-MM-DD format
  let dateStr = formatDate(dateToFind);

  //returns yyyy/mm/dd - now replace / with -

  let foundVal = 0;
  //now loop through them
  for(const dp of dps.widgetDataPoints) {
    if(dp.record_date == dateStr ){
      foundVal = dp.value;
      break;
    }
  };

  return foundVal;

}

/**
 * Update the metric for a date - also recalcs the opacity
 * @param widgetID
 * @param dateToFind
 * @param newValue
 */
function updateMetricValInWidgetForDate(widgetID: number, dateToUpdate: Date, newValue: number)  {

  //Get the datapoints for this widget
  let dps = widgets.value[widgetID];

  //get the date in YYYY-MM-DD format
  let dateStr = formatDate(dateToUpdate);

  //returns yyyy/mm/dd - now replace / with -

  //now loop through them
  for (const dp of dps.widgetDataPoints) {
    if (dp.record_date == dateStr) {
      dp.value = newValue;
      //foundVal = dp.value;
      break;
    }
  };

  return;

}


function formatDate(date : Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const localDate = `${year}-${month}-${day}`;
  return localDate;
};
const url = import.meta.env.VITE_WIDGETRY_URL;

//datetime.addEventListener('ionChange', (e) => setDateTimeValue(e.detail.value));
/**
 * MODAL STUFF
 */

const modal = ref();

const isModalOpen = ref(false);

const dismiss = () => modal.value.$el.dismiss();

const modalTitle = ref("");

const setOpen = (open: boolean) => (isModalOpen.value = open);

/**
 * This handles when we open the model to enter values
 * sets the title & metric value and stores the ID
 * @param e
 */
function openModal(e: { target: { closest: (arg0: string) => { (): any; new(): any; dataset: { (): any; new(): any; widgetid: any; widgettitle: any; }; }; }; }) {
  console.log(e);

  //Set the title
  let title = e.target.closest(".widget-card").dataset.widgettitle;
  modalTitle.value = title;

  //Save the widget ID
  let id: string = e.target.closest(".widget-card").dataset.widgetid;
  console.log('editing' + id);
  widgetBeingEdited.value = Number(id);

  //How do we set the date to today?
  let x = widgets.value[Number(id)];
  console.log(x);

  metricValue.value = 0;
  metricValue.value = findMetricValInWidgetForDate(widgetBeingEdited.value, currDate.value);
  console.log(id + title);
  isModalOpen.value = true;
}

/**
 * Hnadles when save is pressed on the modal...
 * If the value has changed then let's save it to Notion
 * @param e
 */
function savePressed(e: any) {
  console.log('save pressed');
  console.log(metricValue.value);

  //Close the modal
  setOpen(false);

  //OK if the value changed we need to store it in Notion
  //Check the value on th einput field vs the one in the widget
  let val = findMetricValInWidgetForDate(widgetBeingEdited.value, currDate.value);

  if(val == metricValue.value){
    //its the same so no save needed
    return;

  }

  console.log('we have a change');

  let dp : DataPoint = {
    record_date : formatDate(currDate.value),
    value : metricValue.value,
    opacity : .6
  }

  //Need to get the WidgetID on Widgetry

  let id = widgets.value[widgetBeingEdited.value].widgetID;

  //Lets call the api with the change - this will save it to Widgetry AND to Notion
  WidgetryTools.saveDatapoint(dp, id);

  //now update the value we have internally
  updateMetricValInWidgetForDate(widgetBeingEdited.value, currDate.value, metricValue.value );

  //and finally let's update the opacity
  let ret = WidgetBuilder.calcOpacity(widgets.value[widgetBeingEdited.value]);
  console.log(widgets.value[widgetBeingEdited.value]);
  widgets.value[widgetBeingEdited.value] = ret;
}

function onDidDismiss(event: any) {


  isModalOpen.value = false;


};

/**
 * END MODAL STUFF
 */

watch(() => state.isLoading,
  (isLoading) => {
    console.log('isloading changed' + isLoading)

    //If we are loading then return immediately
    if (isLoading) {
      return;
    }

    WidgetBuilder.loadAllWidgetsFromStorage()
      .then((data : any) => {
        console.log('back from loadall')
        console.log(data);
        widgets.value = data;
        console.log('added');

      });
  }

)
onBeforeUpdate(async () => {

  console.log('date' + maxDate);
  //const test = await storage.get('test');
  //await storage.set("my-key", "junki")

  //lets get the widgets from state
  //TODO if no widget found then kick off sync

  //Load the widgets from storage
  console.log('loading in Homepage' + state.isLoading)
  if (state.isLoading) {
    console.log('no cos still loading');
    return;
  }
  console.log('we are loading');
  WidgetBuilder.loadAllWidgetsFromStorage()
    .then((data : any)    => {
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
