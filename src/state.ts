import { reactive } from 'vue'

export const state = reactive({
    token: "",
    isUserLoggedIn: false,
    widgetData: {},
    isLoading: false
})