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
        return controller.get(field)?.find((e) => e == t.value);
      })}
      onChange={(newValue) => {
        controller.handleChange(
          field,
          newValue.map((v) => v.value)
        );
      }}
      menuPortalTarget={document.body}
    />
  );
}
