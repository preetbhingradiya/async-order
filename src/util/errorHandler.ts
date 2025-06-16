import { validate } from "class-validator";

export const validationError = async (dto) =>{
  const errors = await validate(dto);
  console.log(errors);
  
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