import { Drivers, Storage } from '@ionic/storage';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';


const storage = new Storage({
    driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
});

storage.create().then(store => {
    console.log("VALUE: ", store)
    console.log('Storage created')
})

storage.defineDriver(CordovaSQLiteDriver).then(() => {
})

export default storage