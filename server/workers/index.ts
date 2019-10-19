import axios from "axios";

const FINGERPRINT_WORKER_ADDRESS = "http://fingerprint_worker:5001";
const GENERATE_FINGERPRINT_ENDPOINT = `${FINGERPRINT_WORKER_ADDRESS}/generate_fingerprint`;

// TODO: this whole module needs to be removed

export default {
    fingerprintWorker: {
        generateFingerprint: async (i_oSignalData: any) => {
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