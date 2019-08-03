import KEYS from "@/keys";
const plotlyInstance = require("plotly")(KEYS.PLOTLY_API_USERNAME, KEYS.PLOTLY_API_KEY);


export const timeout = time => new Promise(resolve => setTimeout(resolve, time));

export const plotly = plotlyInstance;

export default {
    timeout,
    plotly
};