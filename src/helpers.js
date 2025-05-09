export const mapInputValuesWithDefaults = (fields, data) => {
  return fields.reduce((acc, field) => {
    switch (field.id) {
      case "price":
        acc[field.id] = data.value;
        break;
      case "quantity":
        acc[field.id] = 1;
        break;
      default:
        acc[field.id] = "";
        break;
    }
    return acc;
  }, {});
};
