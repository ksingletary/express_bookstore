const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { ValidationError } = require("../expressError");

function validate(schema) {
    return (req, res, next) => {
      const ajv = new Ajv({ allErrors: true });
      addFormats(ajv);
      const validateSchema = ajv.compile(schema);
      const valid = validateSchema(req.body);
 
      if (!valid) {
        const errors = validateSchema.errors.map(e => e.message);
        return next(new ValidationError(errors));
      } else {
        return next();
      }
    };
}
 
module.exports = validate;