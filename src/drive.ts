import Corestore from "corestore";
import Hyperdrive from "hyperdrive";
import Localdrive from "localdrive";
import MirrorDrive from "mirror-drive";

import consola from "consola";
const logger = consola.withTag("drive");

const corestore = new Corestore("./corestore");

const hyperdrive = new Hyperdrive(corestore);
const localdrive = new Localdrive('./src');
const mirrordrive = new MirrorDrive(localdrive, hyperdrive);

logger.info(mirrordrive.count); // => { files: 0, add: 0, remove: 0, change: 0 }

for await (const diff of mirrordrive) {
	logger.info(diff);
}

// To create a full typings file for hypercore by holepunchto, you can start by referencing the existing type declaration file mentioned in the GitHub issue Source 3. This file was created by a user named phoenix344 and is available as a gist. You can find the gist at the following URL: https://gist.github.com/phoenix344/035cc9cf6728ce3619d0caa760e1f44a.

// The gist provides a starting point for TypeScript typings for hypercore. However, it's important to note that the typings might not be complete or up-to-date with the latest version of hypercore. You may need to update or extend these typings based on the current API documentation available at docs.pears.com Source 0.

// Here's a basic outline of steps you can follow to create or update the typings:

// Review the Existing Typings: Start by reviewing the existing typings provided in the gist. This will give you an understanding of the current state of typings for hypercore.
// Check the Latest API Documentation: Visit the official API documentation at docs.pears.com to understand the latest features and changes in hypercore. This will help you identify any missing or outdated typings.
// Update or Extend the Typings: Based on your review, update or extend the typings to include any new features or changes in the API. Ensure that all methods, properties, and events are correctly typed.
// Test Your Typings: After updating the typings, test them in your project to ensure they work as expected. This might involve creating a small test project or updating an existing project to use the new typings.
// Contribute Back: If you find that your typings are significantly different from the existing ones or if you've added new features, consider contributing them back to the hypercore project. This could be in the form of a pull request or by opening an issue to discuss the changes.
// Remember, creating or updating typings for a library like hypercore is a community effort. Your contributions can help other developers who use hypercore with TypeScript.
