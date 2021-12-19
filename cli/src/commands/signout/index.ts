import { Command, Flags } from "@oclif/core";
import cli from "cli-ux";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";

interface Args {
  username?: string;
  password?: string;
}

export default class Signin extends Command {
  static description = "Signout of Shabam.";

  static examples = [`$ shabam signout`];

  async run(): Promise<void> {
    await this.parse<GetF<typeof Signin>, Args>(Signin);

    cli.action.start("Signing out");

    const auth = new AuthenticationService(this);

    try {
      await auth.clearAuthToken();
    } catch (err) {
      this.error("Failed to signout.");
    }

    cli.action.stop();
  }
}
