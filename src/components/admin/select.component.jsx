import { Select } from "chakra-react-select";

export default function BasicMultiSelect({ options, controller, field }) {
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
      value={options.filter((t) => {
        return controller.get(field)?.find((e) => e == t.value);
      })}
      onChange={(newValue) => {
        controller.handleChange(
          field,
          newValue.map((v) => v.value)
        );
      }}
      isMulti
      menuPortalTarget={document.body}
    />
  );
}
