import * as Config from "@/config";

export default {
  PRODUCTION: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || Config.defaultPort,
};
