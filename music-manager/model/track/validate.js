const Validator = require("./../../utility/Validator.js");

async function validate(object = {}, schema = {}) {
  const validator = new Validator(schema);
  await validator.validate(object);

  if (validator.errors.length > 0) throw validator.errors;
  else return object;
}

module.exports = validate;
