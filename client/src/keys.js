export default {
    PLOTLY_API_USERNAME: process.env.VUE_APP_PLOTLY_API_USERNAME,
    PLOTLY_API_KEY: process.env.VUE_APP_PLOTLY_API_KEY,
    PRODUCTION: process.env.NODE_ENV === "production"   
}