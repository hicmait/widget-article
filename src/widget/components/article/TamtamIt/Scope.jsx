import React from "react";

import _ from "i18n";
import Switch from "Common/Switch/Switch";
import DisabledSwitch from "Common/Switch/Switch/DisabledSwitch";
import GroupsSelect from "./GroupsSelect";
import styles from "./Scope.module.scss";

export default function Scope(props) {
  const { auth, community, selectStyles, scope, groups } = props;

  const handleChange = (name, value) => {
    if (name === "PUBLIC") {
      props.handleChange(value ? [name] : ["PUBLIC"]);
    } else {
      let tmpValue = value
        ? [...scope.filter((item) => item !== "PUBLIC"), name]
        : scope.filter((item) => item !== name);
      if (tmpValue.length === 0) {
        tmpValue = ["PUBLIC"];
      }
      props.handleChange(tmpValue);
    }
  };
  const handleSetSelectedGroups = (groups) => {
    props.handleGroupsChange(groups);
  };

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <ul className={styles.switches}>
        <li>
          <span>{_("all")}</span>
          <Switch
            isChecked={scope.includes("PUBLIC")}
            onChange={(e) => handleChange("PUBLIC", e)}
          />
        </li>
        <li>
          <span>{_("clients")}</span>
          {!community ? (
            <DisabledSwitch isChecked={scope.includes("CLIENT")} />
          ) : (
            <Switch
              isChecked={scope.includes("CLIENT")}
              onChange={(e) => handleChange("CLIENT", e)}
              disabled={!community}
            />
          )}
        </li>
        <li>
          <span>{_("collaborators")}</span>
          {!community ? (
            <DisabledSwitch isChecked={scope.includes("COLLABORATOR")} />
          ) : (
            <Switch
              isChecked={scope.includes("COLLABORATOR")}
              onChange={(e) => handleChange("COLLABORATOR", e)}
              disabled={!community}
            />
          )}
        </li>
        <li>
          <span>{_("member")}</span>
          {scope.includes("GROUP") || !community ? (
            <DisabledSwitch isChecked={scope.includes("MEMBER")} />
          ) : (
            <Switch
              isChecked={scope.includes("MEMBER")}
              onChange={(e) => handleChange("MEMBER", e)}
              disabled={scope.includes("GROUP") || !community}
            />
          )}
        </li>
        <li>
          <span>{_("groups")}</span>
          {scope.includes("MEMBER") || !community ? (
            <DisabledSwitch isChecked={scope.includes("GROUP")} />
          ) : (
            <Switch
              isChecked={scope.includes("GROUP")}
              onChange={(e) => handleChange("GROUP", e)}
              disabled={scope.includes("MEMBER") || !community}
            />
          )}
        </li>
      </ul>
      {scope.includes("GROUP") && (
        <GroupsSelect
          isMulti={true}
          selectedGroups={groups}
          onChange={handleSetSelectedGroups}
          auth={auth}
          community={community}
          selectStyles={selectStyles}
        />
      )}
    </div>
  );
}
