import axios from "axios";
import { AudioFingerprint } from "@/audio";

/**
 * Sends the current fingerprint to the server for identification.
 * 
 * @param {Array} i_aFingerprint The fingerprint data (an array of Uint8Arrays).
 */
export async function identifyTrack(i_aFingerprint) {
    const { 
        condensedData: u8CondensedFingerprint,
        windowNumber: nNumWindows,
        partitionNumber: nNumPartitions
    } = AudioFingerprint.condenseFingerprint(i_aFingerprint);

    // const fingerprintFile = new File(
    //     [u8CondensedFingerprint.buffer], 
    //     "fingerprint", 
    //     { type: "application/octet-stream", lastModified: Date.now() }
    // );

    const fingerprintBlob = new Blob([u8CondensedFingerprint.buffer], {
        type: "application/octet-stream"
    });

    // Send fingerprint to the server
    try {
        const operations = {
            query: `
                query SearchTrack($fingerprint: Upload!, $fingerprintInfo: FingerprintInfo!) {
                    searchTrack(fingerprint: $fingerprint, fingerprintInfo: $fingerprintInfo) {
                        _id,
                        metaData {
                            title,
                            artists,
                            coverImage,
                            uploaderEmail,
                            releaseDate,
                            createdDate,
                            updatedDate
                        }
                    }
                }
            `,
            variables: {
                fingerprint: null,
                fingerprintInfo: {
                    windowAmount: nNumWindows,
                    partitionAmount: nNumPartitions
                }
            }
        };

        const map = {
            "0": ["variables.fingerprint"]
        };

        const fd = new FormData();
        fd.append("operations", JSON.stringify(operations));
        fd.append("map", JSON.stringify(map));
        fd.append(0, fingerprintBlob, "fingerprint");
        // fd.append(0, fingerprintFile, fingerprintFile.name);

        const res = await axios.post("/api/graphql", fd, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${fd._boundary}`
            }
        });

        console.log("RES DATA", res.data.data);

    } catch(err) {
        console.log("ERROR", err.response.data.errors);
    }
}

export default {
    identifyTrack
};