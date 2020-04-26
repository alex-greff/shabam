import { Request, Response, NextFunction } from "express";
import * as Utilities from "@/worker/utilities";

interface BodyContent {
    windowAmount: string;
    partitionAmount: string;
}


export const identify_fingerprint = async (req: Request<any, any, BodyContent>, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fingerprintFile = files["fingerprint"][0];
    const windowAmount = parseInt(req.body.windowAmount);
    const partitionAmount = parseInt(req.body.partitionAmount);

    // TODO: remove
    console.log("FINGERPRINT", fingerprintFile);
    console.log("Window amount", windowAmount);
    console.log("Partition amount", partitionAmount);

    // const fingerprintBuffer = await Utilities.getFingerprintBuffer(fingerprintReadStream)
    const fingerprintBuffer = fingerprintFile.buffer;
    const fingerprintCondensedData = Utilities.getFingerprintData(fingerprintBuffer);
    const fingerprintData = Utilities.uncondenseFingerprintData(fingerprintCondensedData, windowAmount, partitionAmount);

    // TODO: remove
    console.log("Condensed Fingerprint Data", fingerprintCondensedData);
    console.log("Fingerprint data", fingerprintData);

    // Send response
    res.status(200).json({ message: "TODO: implement"} );
}