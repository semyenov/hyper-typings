import consola from "consola";

import Corestore from "corestore";
import Hyperdrive from "hyperdrive";
import Localdrive from "localdrive";
import MirrorDrive from "mirror-drive";

const logger = consola.withTag("drive");

const corestore = new Corestore(".out/corestore");
const hyperdrive = new Hyperdrive(corestore);
const localdrive = new Localdrive("./src");
const mirrordrive = new MirrorDrive(localdrive, hyperdrive);

logger.info(mirrordrive.count); // => { files: 0, add: 0, remove: 0, change: 0 }

for await (const diff of mirrordrive) {
  logger.info(diff);
}