import { Command, Flags } from "@oclif/core";
import color from "@oclif/color";
import { AuthenticationService } from "../services/authentication.service";
import { assert } from "tsafe";
import * as AuthenticationPrompts from "../prompts/authentication.prompts";
import { Sdk } from "../graphql-request.g";
import * as Utilities from "../utilities";
import { Input } from "@oclif/core/lib/interfaces";


export abstract class AuthenticatedCommand extends Command {
  private _token: string | null = null;
  private _sdkClient: Sdk | null = null;

  protected get token() {
    if (!this._token)
      throw new Error(
        "Authentication token not initialized (perhaps super.run() was not called)."
      );
    return this._token;
  }

  protected get sdkClient(): Sdk {
    if (!this._sdkClient)
      this._sdkClient = Utilities.getGraphqlClientSdk(this.token);

    return this._sdkClient!;
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
    // Source: https://github.com/oclif/oclif/issues/225
    const { flags } = await this.parse(<Input<any>>this.constructor);

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

        this.log(`Signed in as ${color.blueBright(username)}!`);
      }

      assert(username && password);

      // Fetch new token
      token = await auth.hydrateAuthToken(username, password);
    }

    this._token = token;
  }
}
