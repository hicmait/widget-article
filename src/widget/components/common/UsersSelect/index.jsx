import React from "react"; //{ useRef }
import { useSelector } from "react-redux";
import { components as selectComponents } from "react-select";
import AsyncSelect from "react-select/async";

import * as api from "Api";

import { avatarStyle, singleValueStyle } from "./SelectStyle";

// import debounce from "lodash.debounce";
import _ from "i18n";

const Input = (props) => {
  if (props.isHidden) {
    return <selectComponents.Input {...props} />;
  }
  return (
    <div>
      <selectComponents.Input {...props} />
    </div>
  );
};

const SingleValue = ({ children, ...props }) => {
  const { avatarUrl, firstName } = props.data;

  return (
    <selectComponents.SingleValue {...props}>
      <div style={singleValueStyle()}>
        {" "}
        <span style={avatarStyle(avatarUrl && `url('${avatarUrl}')`)}>
          {" "}
          {!avatarUrl && firstName && firstName.charAt(0)}
        </span>
        {children}
      </div>
    </selectComponents.SingleValue>
  );
};

const Option = (props) => {
  const { children, ...rest } = props;
  const { avatarUrl, firstName } = rest.data;

  const withAvatarChildren = (
    <div style={singleValueStyle()}>
      <span style={avatarStyle(avatarUrl && `url('${avatarUrl}')`)}>
        {!avatarUrl && firstName && firstName.charAt(0)}
      </span>
      {children}
    </div>
  );

  return <selectComponents.Option {...rest} children={withAvatarChildren} />;
};

const MultiValueLabel = ({ children, ...props }) => {
  const { avatarUrl, firstName } = props.data;

  const style = {
    display: "flex",
    alignItems: "center",
  };

  const avatarStyle = {
    backgroundColor: "#CCC",
    backgroundImage: avatarUrl && `url('${avatarUrl}')`,
    width: "20px",
    height: "20px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "50%",
    flexShrink: "0",
    marginRight: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    color: "#000",
  };

  return (
    <selectComponents.MultiValueLabel {...props}>
      <div style={style}>
        <span style={avatarStyle}>
          {!avatarUrl && firstName && firstName.charAt(0)}
        </span>
        {children}
      </div>
    </selectComponents.MultiValueLabel>
  );
};

export const UsersSelect = (props) => {
  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  const loadUsersSuggestions = (inputValue) => {
    return api
      .getUsers({ token, search: inputValue })
      .then((result) => result.data.data);
  };
  // const _loadUsersSuggestions = useRef(
  //   debounce((query) => loadUsersSuggestions(query), 500)
  // ).current;

  const { user, onChange } = props;

  return (
    <AsyncSelect
      value={user}
      onChange={onChange}
      loadOptions={loadUsersSuggestions}
      defaultOptions={true}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      getOptionValue={(option) => option.id}
      components={{ Option, SingleValue, Input }}
      placeholder={_("Select user...")}
      classNamePrefix="media-user-select"
    />
  );
};

export const UsersMultiSelect = (props) => {
  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  const loadUsersSuggestions = (query) => {
    return api
      .getUsers({ token, search: query })
      .then((result) => result.data.data);
  };

  const { users, onChange } = props;
  return (
    <AsyncSelect
      value={users}
      isMulti={true}
      onChange={onChange}
      loadOptions={loadUsersSuggestions}
      defaultOptions={true}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      getOptionValue={(option) => option.id}
      components={{ Option, MultiValueLabel, Input }}
      classNamePrefix="media-user-multi-select"
    />
  );
};
