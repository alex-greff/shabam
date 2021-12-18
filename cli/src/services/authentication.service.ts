import { Command } from "@oclif/core";
import KEYS from "../keys";

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
    email: string,
    password: string
  ): Promise<string> {
    this.cmd.log("TODO: implement hydrateAuthToken");
    return "TODO: token here";
  }

  public async clearAuthToken(): Promise<void> {
    this.cmd.log("TODO: implement clearAuthToken");
  }
}
