export interface DataPoint{
    record_date : string,
    value : number
    opacity: number
    isDirty?: boolean
}
export interface Widget {
    widgetID: Number,
    widgetDataPoints: Array<DataPoint>,
    widgetInfo: {
        description : string,
        color : string
    }

}