export const selectStyle = () => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0",
    backgroundColor: "#fff", //,
    //height: "2.8rem"
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "1rem",
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
    borderRadius: "0",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
  }),
});

export const avatarStyle = (avatar) => ({
  backgroundColor: "#EEE",
  backgroundImage: avatar,
  width: "30px",
  height: "30px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "50%",
  flexShrink: "0",
  marginRight: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "1rem",
  textTransform: "uppercase",
  color: "#000",
});

export const singleValueStyle = () => ({
  display: "flex",
  alignItems: "center",
});
