import { program } from "commander";
import {DID} from "./did";

program
  .command("update")
  .description("update a did document")
  .argument("<did>", "the did identifier of the document")
  .action(async (did) => {
    await DID.getInstance().pushDidDocument(did);
  });

program
  .command("doc")
  .description("get the document of a did")
  .action(async () => {
    // const cg = new Choreographer();
    // await cg.init();
    // await cg.deployAll();
  });

program.parse();