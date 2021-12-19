import { Command } from "@oclif/core";
import * as path from "path";
import * as fs from "fs";
import * as Utilities from "../utilities";
import * as Constants from "../constants";
import { getSdk } from "../graphql-request.g";

export type AuthenticationMode = "signin" | "signup";

export class AuthenticationService {
  constructor(private cmd: Command) {}

  private get authTokenPath(): string {
    return path.join(this.cmd.config.dataDir, Constants.TOKEN_DIR);
  }

  public async getAuthToken(): Promise<string | null> {
    const exists = await fs.promises
      .access(this.authTokenPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      const token = await fs.promises.readFile(this.authTokenPath, "utf-8");
      return token;
    }

    return null;
  }

  public async hydrateAuthToken(
    username: string,
    password: string,
    mode: AuthenticationMode = "signin"
  ): Promise<string> {
    const client = Utilities.getGraphqlClient();
    const sdk = getSdk(client);

    let token: string = "";

    if (mode === "signin") {
      const res = await sdk.signin({
        username,
        password,
      });
      token = res.login.access_token;
    } else {
      const res = await sdk.signup({
        username,
        password,
      });
      token = res.signup.access_token;
    }

    // Save the token
    await fs.promises.writeFile(this.authTokenPath, token);

    return token;
  }

  public async clearAuthToken(): Promise<boolean> {
    const exists = await fs.promises
      .access(this.authTokenPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      await fs.promises.unlink(this.authTokenPath);
      return true;
    }

    return false;
  }
}
