export const selectStyle = () => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: "2rem",
    backgroundColor: "#fff",
    height: "1.75rem",
    border: "none",
    marginBottom: "1rem",
    padding: 0,
    minHeight: 0,
    margin: 0,
  }),
  input: (provided, state) => ({
    ...provided,
    height: "1.25rem",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    height: "1.75rem",
    padding: "0 12px 2px",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    display: "contents",
    fontWeight: "600",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "1.75rem",
  }),
  dropdownIndicator: (provided, state) => ({
    display: "none",
  }),
  indicatorSeparator: (provided, state) => ({
    display: "none",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: ".75rem",
    color: "#bbb",
    fontWeight: 300,
  }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: "0",
    paddingBottom: "0",
  }),
  menu: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    height: "15rem",
    top: "1.375rem",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "#F1F2F4",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: ".75rem",
    textTransform: "uppercase",
    color: "inherit",
  }),
});
