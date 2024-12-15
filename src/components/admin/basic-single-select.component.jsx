import { Select } from "chakra-react-select";

export default function BasicSingleSelect({ options, controller, field }) {
  return (
    <Select
      options={options}
      selectedOptionStyle="check"
      colorScheme="green"
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          width: "100%",
        }),
        control: (provided) => ({
          ...provided,
          width: "100%",
        }),
      }}
      value={options.find((t) => {
        return t.value == controller.get(field);
      })}
      onChange={(newValue) => {
        console.log("NEW VALUE: ", newValue.value);
        controller.handleChange(field, newValue.value);
      }}
      menuPortalTarget={document.body}
    />
  );
}
