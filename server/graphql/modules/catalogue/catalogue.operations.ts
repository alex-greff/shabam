<<<<<<< HEAD:server/graphql/modules/catalogue/catalogue.operations.ts
import { Track } from "../../../index";
import { UploadFile } from "../../../index";
import * as helpers from "./catalogue.helpers";
import workers from "../../../workers";
=======
import { Track } from "../../../types";
>>>>>>> typescript:server/graphql/modules/catalogue/catalogue.operations.js
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import stream from "stream";
<<<<<<< HEAD:server/graphql/modules/catalogue/catalogue.operations.ts
import { FingerprintUtilities } from "../../../utilities";

interface GetTrackArgs {
    trackID: number
}

interface SearchTrackArgs {
    fingerprint: Promise<UploadFile>;
    fingerprintInfo: {
        windowAmount: Number
        partitionAmount: Number
    }
}

interface AddTrackArgs {
    fingerprint: Promise<UploadFile>;
    trackData: {
        title: string;
        artists: string[];
        coverImage?: string;
        releaseDate?: string;
    };
}

interface EditTrackArgs {
    trackID: number;
    updatedTrackData: {
        title?: string;
        artists?: string[];
        coverImage?: string;
        releaseDate?: string;
    };
}

interface DeleteTrackArgs {
    trackID: number;
}

interface RecomputeTrackFingerprintArgs {
    trackID: number;
    fingerprint: Promise<UploadFile>;
}
=======
import * as helpers from "./catalogue.helpers";
import workers from "../../../workers";
import { FingerprintUtilities } from "../../../utilities";
import { 
    GetTrackArgs, 
    SearchTrackArgs, 
    AddTrackArgs,
    EditTrackArgs,
    DeleteTrackArgs,
    RecomputeTrackFingerprintArgs
} from "./catalogue.operations.types";

// const helpers = require("./catalogue.helpers");
// const workers = require("../../../workers");
// const fs = require("fs");
// const FormData = require("form-data");
// const axios = require("axios");
// const stream = require("stream");
// const { FingerprintUtilities } = require("../../../utilities");
>>>>>>> typescript:server/graphql/modules/catalogue/catalogue.operations.js

export default {
    getAllTracks: async (root: any, args: any, context: any): Promise<any> => {
        const allTracks = await helpers.getAllTracks();

        return allTracks;
    },
    getTrack: async (root: any, { trackID }: GetTrackArgs, context: any): Promise<Track> => {
        const trackData = await helpers.getTrack(trackID);

        return trackData;
    },
    searchTrack: async (root: any, { fingerprint, fingerprintInfo }: SearchTrackArgs, context: any): Promise<any> => { // TODO: fix return typedef
        const { windowAmount, partitionAmount } = fingerprintInfo;

        // TODO: implement
        // const fingerprintRes = await fingerprint;

        const { filename, mimetype, createReadStream }: UploadFile = await fingerprint;

        const fingerprintBuffer = await FingerprintUtilities.getFingerprintBuffer(createReadStream);
        let fingerprintData = FingerprintUtilities.getFingerprintData(fingerprintBuffer);

        // TODO: remove
        console.log("Fingerprint Buffer", fingerprintBuffer);
        console.log("Fingerprint Data", fingerprintData);
        console.log("Fingerprint Info", fingerprintInfo);

        // TODO: remove
        // Writes to a test file
        // NOTE: make sure "temp" directory exists
        // const writeStream = fs.createWriteStream("./temp/something");
        // fingerprintReadStream.pipe(writeStream);

        // TODO: remove
        // Writes to a test file
        // NOTE: make sure "temp" directory exists
        // const writeStream = fs.createWriteStream("./temp/test.wav");
        // audioReadStream.pipe(writeStream);

        // TODO: remove
        // const fd = new FormData();
        // fd.append("audioFile", audioReadStream, filename);

        // const res = await axios.post("http://fingerprint_worker:5001/generate_fingerprint", fd, {
        //     headers: { ...fd.getHeaders() }
        // });

        // console.log("FINGERPRINT WORKER RES", res.data);

        const fingerprintReadStream = createReadStream();

        // Send fingerprintReadStream to the identification worker

        const fd = new FormData();
        fd.append("fingerprint", fingerprintReadStream, filename);
        fd.append("windowAmount", windowAmount);
        fd.append("partitionAmount", partitionAmount);

        const endpointURL = "http://identification_worker:5002/identify_fingerprint";
        const res = await axios.post(endpointURL, fd, {
            headers: { ...fd.getHeaders() }
        });

        console.log("IDENTIFICATION WORKER RES", res.data);

        return null;
    },
    addTrack: async (root: any, { fingerprint, trackData }: AddTrackArgs, context: any): Promise<Track> => {
        const { title, artists, coverImage, releaseDate } = trackData; // TODO: get signal data
        const { email } = context.userData;

        // TODO: remove
        // const fingerprintData = await workers.fingerprintWorker.generateFingerprint({}); // TODO: pass in signal data
        // const fingerprintData = { "something": "foo" };

<<<<<<< HEAD:server/graphql/modules/catalogue/catalogue.operations.ts
        const trackID = await helpers.addTrack(title, artists, email, coverImage, releaseDate);
=======
        const trackID = await helpers.addTrack(title, artists, coverImage!, releaseDate, email);
>>>>>>> typescript:server/graphql/modules/catalogue/catalogue.operations.js

        // TODO: send fingerprint to a records worker to compute and add it to a records database
        // Get the records database number that it was added to
        // Update the current tracks address_database attribute with it

        // Get the track that was just added
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    editTrack: async (root: any, { trackID, updatedTrackData }: EditTrackArgs, context: any): Promise<Track> => {
        const { title: newTitle, artists: newArtists, 
            coverImage: newCoverImage, releaseDate: newReleaseDate } = updatedTrackData;

        // Update the track
        await helpers.editTrack(trackID, newTitle, newArtists, newCoverImage, newReleaseDate);

        // Get the updated track
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    deleteTrack: async (root: any, { trackID }: DeleteTrackArgs, context: any): Promise<boolean> => {
        await helpers.deleteTrack(trackID);

        return true;
    },
    recomputeTrackFingerprint: async (root: any, { trackID, fingerprint }: RecomputeTrackFingerprintArgs, context: any): Promise<any> => { // TODO: complete return typeDef
        // TODO: complete
    }
};