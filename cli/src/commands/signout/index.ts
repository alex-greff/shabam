import { Command } from "@oclif/core";
import { GetF } from "../../types";
import { AuthenticationService } from "../../services/authentication.service";
import color from "@oclif/color";

interface Args {
  username?: string;
  password?: string;
}

export default class Signin extends Command {
  static description = "Signout of Shabam.";

  static examples = [`$ shabam signout`];

  async run(): Promise<void> {
    await this.parse<GetF<typeof Signin>, Args>(Signin);

    const auth = new AuthenticationService(this);

    try {
      await auth.clearAuthToken();
    } catch (err) {
      this.error(`${color.red("Failed to signout!")}`);
    }

    this.log(`${color.blueBright("Signed out!")}`);
  }
}
