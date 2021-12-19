import { Command } from "@oclif/core";
import * as Utilities from "../utilities";
import { getSdk } from "../graphql-request.g";

export class AuthenticationService {
  constructor(private cmd: Command) {}

  public async getAuthToken(promptCreds: true): Promise<string>;
  public async getAuthToken(
    promptCreds: boolean = false
  ): Promise<string | null> {
    this.cmd.log("TODO: implement getAuthToken");
    return null;
  }

  public async hydrateAuthToken(
    username: string,
    password: string
  ): Promise<string> {
    const client = Utilities.getGraphqlClient();
    const sdk = getSdk(client);

    const res = await sdk.signin({
      username,
      password,
    });

    const token = res.login.access_token;

    // TODO: save token

    return token;
  }

  public async clearAuthToken(): Promise<void> {
    this.cmd.log("TODO: implement clearAuthToken");
  }
}
