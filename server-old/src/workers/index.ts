import axios from "axios";

const FINGERPRINT_WORKER_ADDRESS = "http://fingerprint-worker:5001";
const GENERATE_FINGERPRINT_ENDPOINT = `${FINGERPRINT_WORKER_ADDRESS}/generate_fingerprint`;

export default {
  fingerprintWorker: {
    generateFingerprint: async (signalData: object) => {
      const res = await axios.post(GENERATE_FINGERPRINT_ENDPOINT, {
        signalData: { ...signalData },
      });

      return res.data.fingerprint;
    },
  },
  identificationWorker: {
    // TODO: implement
  },
};
