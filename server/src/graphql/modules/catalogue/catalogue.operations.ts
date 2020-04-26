import { AppContext } from "@/types";
import { Track } from "@/types/schema";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import stream from "stream";
import * as helpers from "./catalogue.helpers";
import workers from "@/workers";
import { FingerprintUtilities } from "@/utilities";
import { 
    GetTrackArgs, 
    SearchTrackArgs, 
    AddTrackArgs,
    EditTrackArgs,
    DeleteTrackArgs,
    RecomputeTrackFingerprintArgs
} from "./catalogue.operations.types";

export default {
    getAllTracks: async (root: any, args: any, context: AppContext): Promise<any> => {
        const allTracks = await helpers.getAllTracks();

        return allTracks;
    },
    getTrack: async (root: any, { trackID }: GetTrackArgs, context: AppContext): Promise<Track> => {
        const trackData = await helpers.getTrack(trackID);

        return trackData;
    },
    searchTrack: async (root: any, { fingerprint, fingerprintInfo }: SearchTrackArgs, context: AppContext): Promise<any> => { // TODO: fix return typedef
        const { windowAmount, partitionAmount } = fingerprintInfo;

        // TODO: implement
        const fingerprintRes = await fingerprint;

        const { filename, mimetype, createReadStream } = await fingerprint;

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

        // const res = await axios.post("http://fingerprint-worker:5001/generate_fingerprint", fd, {
        //     headers: { ...fd.getHeaders() }
        // });

        // console.log("FINGERPRINT WORKER RES", res.data);

        const fingerprintReadStream = createReadStream();

        // Send fingerprintReadStream to the identification worker

        const fd = new FormData();
        fd.append("fingerprint", fingerprintReadStream, filename);
        fd.append("windowAmount", windowAmount);
        fd.append("partitionAmount", partitionAmount);

        const endpointURL = "http://identification-worker:5002/identify_fingerprint";
        const res = await axios.post(endpointURL, fd, {
            headers: { ...fd.getHeaders() }
        });

        console.log("IDENTIFICATION WORKER RES", res.data);

        return null;
    },
    addTrack: async (root: any, { fingerprint, trackData }: AddTrackArgs, context: AppContext): Promise<Track> => {
        const { title, artists, coverImage, releaseDate } = trackData; // TODO: get signal data
        const { username } = context.req.session!.userData!;

        // TODO: remote
        // const fingerprintData = await workers.fingerprintWorker.generateFingerprint({}); // TODO: pass in signal data
        // const fingerprintData = { "something": "foo" };

        const trackID = await helpers.addTrack(title, artists, coverImage!, releaseDate, username);

        // TODO: send fingerprint to a records worker to compute and add it to a records database
        // Get the records database number that it was added to
        // Update the current tracks address_database attribute with it

        // Get the track that was just added
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    editTrack: async (root: any, { trackID, updatedTrackData }: EditTrackArgs, context: AppContext): Promise<Track> => {
        const { title: newTitle, artists: newArtists, 
            coverImage: newCoverImage, releaseDate: newReleaseDate } = updatedTrackData;

        // Update the track
        await helpers.editTrack(trackID, newTitle, newArtists, newCoverImage, newReleaseDate);

        // Get the updated track
        const dbTrackData = await helpers.getTrack(trackID);

        return dbTrackData;
    },
    deleteTrack: async (root: any, { trackID }: DeleteTrackArgs, context: AppContext): Promise<boolean> => {
        await helpers.deleteTrack(trackID);

        return true;
    },
    recomputeTrackFingerprint: async (root: any, { trackID, fingerprint }: RecomputeTrackFingerprintArgs, context: AppContext): Promise<any> => { // TODO: complete return typeDef
        // TODO: complete
    }
};