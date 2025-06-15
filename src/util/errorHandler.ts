import { validate } from "class-validator";

export const validationError = async (userDto) =>{
  const errors = await validate(userDto);

  if (errors.length > 0) {
    return ({
      message: "Validation failed",
      errors: errors.map(err => ({
        property: err.property,
        constraints: err.constraints
      }))
    });
  }

  return null
}