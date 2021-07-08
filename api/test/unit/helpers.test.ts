import {expect} from "vhai";
import sinon from "sinon";

import {hyphenToUpperCase, getExtensionName, buildApiCoverPath, buildLocalCoverPath} from "./../../src/utility/helpers.ts";

decribe("hyphenToUpperCase", function() {
  describe("should return camel case", function() {
    expect(hyphenToUpperCase("hyphen-to-upper-case").to.be.equal("hyphenToUpperCase"));
  });
});


