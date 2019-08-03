export default {
    plotlyAPIUsername: process.env.PLOTLY_API_USERNAME,
    plotlyAPIKey: process.env.PLOTLY_API_KEY,
    PRODUCTION: process.env.NODE_ENV === "production"   
}