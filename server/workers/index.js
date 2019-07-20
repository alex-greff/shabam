const axios = require("axios");

const FINGERPRINT_WORKER_ADDRESS = "http://fingerprint_worker:5001";
const GENERATE_FINGERPRINT_ENDPOINT = `${FINGERPRINT_WORKER_ADDRESS}/generate_fingerprint`;

module.exports = {
    fingerprintWorker: {
        generateFingerprint: async (i_oSignalData) => {
            const res = await axios.post(GENERATE_FINGERPRINT_ENDPOINT, {
                signalData: { ...i_oSignalData }
            });
        
            return res.data.fingerprint;
        }
    },
    identificationWorker: {
        // TODO: implement
    }
};