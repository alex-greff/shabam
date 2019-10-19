import { GraphQLModule, GraphQLModuleOptions } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";

import UploadModule from "../upload";
import headerInjector from "../../injectors/headers";

export interface TrackMetaData {
    title: String;
    artists: String[];
    coverImage?: String;
    uploaderEmail: String;
    releaseDate?: String;
    createdDate: String;
    updatedDate: String;
}

export interface Track {
    _id: Number;
    addressDatabase?: Number;
    metaData: TrackMetaData
}

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});