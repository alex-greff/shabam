import axios from "axios";
<<<<<<< HEAD:server/workers/index.ts
=======
// const axios = require("axios");
>>>>>>> typescript:server/workers/index.js

const FINGERPRINT_WORKER_ADDRESS = "http://fingerprint_worker:5001";
const GENERATE_FINGERPRINT_ENDPOINT = `${FINGERPRINT_WORKER_ADDRESS}/generate_fingerprint`;

<<<<<<< HEAD:server/workers/index.ts
// TODO: this whole module needs to be removed

export default {
    fingerprintWorker: {
        generateFingerprint: async (i_oSignalData: any) => {
=======
export default {
    fingerprintWorker: {
        generateFingerprint: async (signalData: object) => {
>>>>>>> typescript:server/workers/index.js
            const res = await axios.post(GENERATE_FINGERPRINT_ENDPOINT, {
                signalData: { ...signalData }
            });
        
            return res.data.fingerprint;
        }
    },
    identificationWorker: {
        // TODO: implement
    }
};