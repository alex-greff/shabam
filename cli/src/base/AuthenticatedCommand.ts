import { Command, Flags } from "@oclif/core";
import { AuthenticationService } from "../services/authentication.service";
import { assert } from "tsafe";
import * as AuthenticationPrompts from "../prompts/authentication.prompts";

export abstract class AuthenticatedCommand extends Command {
  private _token: string | null = null;

  protected get token() {
    if (!this._token)
      throw new Error(
        "Authentication token not initialized (perhaps super.run() was not called)."
      );
    return this._token;
  }

  static flags = {
    username: Flags.string({
      char: "u",
      description: "Username to login with (if not logged in already).",
      required: false,
    }),
    password: Flags.string({
      char: "p",
      description: "Password to login with (if not logged in already).",
      dependsOn: ["username"],
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(AuthenticatedCommand);

    const auth = new AuthenticationService(this);
    let token = await auth.getAuthToken();

    // Not signed in
    if (!token) {
      // Attempt to grab credentials from flags
      let username = flags.username;
      let password = flags.password;

      // No credentials provided in flags, prompt user
      if (!username) {
        const res = await AuthenticationPrompts.authPrompt.bind(this)();
        username = res.username;
        password = res.password;
      }

      assert(username && password);

      // Fetch new token
      token = await auth.hydrateAuthToken(username, password);
    }

    this._token = token;
  }
}
