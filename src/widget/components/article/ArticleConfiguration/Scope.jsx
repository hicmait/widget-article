import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setArticle } from "../../../redux/actions";

import _ from "../../../i18n";
import Switch from "../../common/Switch/Switch";
import DisabledSwitch from "../../common/Switch/Switch/DisabledSwitch";
import GroupsSelect from "./GroupsSelect";
import CollaboratorsSelect from "./CollaboratorsSelect";
import ClientSelect from "./ClientSelect";
import ContactSelect from "./ContactSelect";
import styles from "./Scope.module.scss";

export default function Scope({ auth, community, selectStyles }) {
  const scope = useSelector((state) => state.articles.article.scope);
  const groups = useSelector((state) => state.articles.article.groups);
  const specCollaborators = useSelector(
    (state) => state.articles.article.specCollaborators
  );
  const specClients = useSelector(
    (state) => state.articles.article.specClients
  );
  const specContacts = useSelector(
    (state) => state.articles.article.specContacts
  );

  const dispatch = useDispatch();
  const IsMediaCommunity = community && community.value === 9;
  const collaboratorScope = IsMediaCommunity
    ? "FID_COLLABORATOR"
    : "ALL_COLLABORATORS";
  const clientScope = IsMediaCommunity ? "FID_CLIENT" : "ALL_CLIENTS";

  const scopes = [
    collaboratorScope,
    clientScope,
    "ALL_CONTACTS",
    "SPEC_COLLABORATOR",
    "SPEC_CLIENT",
    "SPEC_CONTACT",
    "GROUP",
  ];

  const handleChange = (name, value) => {
    if (name === "PUBLIC") {
      dispatch(
        setArticle({ index: "scope", value: value ? [name] : ["PUBLIC"] })
      );
    } else {
      let tmpValue = value
        ? [...scope.filter((item) => item !== "PUBLIC"), name]
        : scope.filter((item) => item !== name);
      if (value) {
        switch (name) {
          case collaboratorScope:
            tmpValue = [
              ...tmpValue.filter((item) => item !== "SPEC_COLLABORATOR"),
            ];
            dispatch(setArticle({ index: "specCollaborators", value: [] }));
            break;
          case clientScope:
            tmpValue = [...tmpValue.filter((item) => item !== "SPEC_CLIENT")];
            dispatch(setArticle({ index: "specClients", value: [] }));
            break;
          case "ALL_CONTACTS":
            tmpValue = [...tmpValue.filter((item) => item !== "SPEC_CONTACT")];
            dispatch(setArticle({ index: "specContacs", value: [] }));
            break;
          case "SPEC_COLLABORATOR":
            tmpValue = [
              ...tmpValue.filter((item) => item !== collaboratorScope),
            ];
            break;
          case "SPEC_CLIENT":
            tmpValue = [...tmpValue.filter((item) => item !== clientScope)];
            break;
          case "SPEC_CONTACT":
            tmpValue = [...tmpValue.filter((item) => item !== "ALL_CONTACTS")];
            break;
        }
      } else {
        switch (name) {
          case "SPEC_COLLABORATOR":
            dispatch(setArticle({ index: "specCollaborators", value: [] }));
            break;
          case "SPEC_CLIENT":
            dispatch(setArticle({ index: "specClients", value: [] }));
            break;
          case "SPEC_CONTACT":
            dispatch(setArticle({ index: "specContacts", value: [] }));
            break;
        }
      }
      if (tmpValue.length === 0) {
        tmpValue = ["PUBLIC"];
      }
      dispatch(setArticle({ index: "scope", value: tmpValue }));
    }
  };
  const handleSetSelectedGroups = (groups) => {
    dispatch(setArticle({ index: "groups", value: groups }));
  };
  const handleSetSelectedCollab = (value) => {
    dispatch(setArticle({ index: "specCollaborators", value }));
  };
  const handleSetSelectedClient = (value) => {
    dispatch(setArticle({ index: "specClients", value }));
  };
  const handleSetSelectedContact = (value) => {
    dispatch(setArticle({ index: "specContacts", value }));
  };

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <ul className={styles.switches}>
        <li>
          <div>
            <span>{_("article.PUBLIC")}</span>
            <Switch
              isChecked={scope.includes("PUBLIC")}
              onChange={(e) => handleChange("PUBLIC", e)}
            />
          </div>
        </li>
        {scopes.map((lScope) => (
          <li key={`scope-${lScope}`}>
            <div>
              <span>{_(`article.${lScope}`)}</span>
              {!community ? (
                <DisabledSwitch isChecked={scope.includes(lScope)} />
              ) : (
                <Switch
                  isChecked={scope.includes(lScope)}
                  onChange={(e) => handleChange(lScope, e)}
                  disabled={!community}
                />
              )}
            </div>
            {lScope === "SPEC_COLLABORATOR" &&
              scope.includes("SPEC_COLLABORATOR") && (
                <CollaboratorsSelect
                  isMulti={true}
                  selectedCollaborators={specCollaborators}
                  onChange={(e) => handleSetSelectedCollab(e)}
                  organizationId={community ? community.value : null}
                  selectStyles={selectStyles}
                />
              )}
            {lScope === "SPEC_CLIENT" && scope.includes("SPEC_CLIENT") && (
              <ClientSelect
                isMulti={true}
                selectedClients={specClients}
                onChange={(e) => handleSetSelectedClient(e)}
                selectStyles={selectStyles}
              />
            )}
            {lScope === "SPEC_CONTACT" && scope.includes("SPEC_CONTACT") && (
              <ContactSelect
                isMulti={true}
                selectedContacts={specContacts}
                onChange={(e) => handleSetSelectedContact(e)}
                organizationId={community ? community.value : null}
                selectStyles={selectStyles}
              />
            )}
            {lScope === "GROUP" && scope.includes("GROUP") && (
              <GroupsSelect
                isMulti={true}
                selectedGroups={groups}
                onChange={handleSetSelectedGroups}
                auth={auth}
                community={community}
                selectStyles={selectStyles}
              />
            )}
          </li>
        ))}
        {/* <li>
          <span>{_("clients")}</span>
          {!community ? (
            <DisabledSwitch isChecked={scope.includes(clientScope)} />
          ) : (
            <Switch
              isChecked={scope.includes(clientScope)}
              onChange={(e) => handleChange(clientScope, e)}
              disabled={!community}
            />
          )}
        </li>
        <li>
          <span>{_("collaborators")}</span>
          {!community ? (
            <DisabledSwitch isChecked={scope.includes(collaboratorScope)} />
          ) : (
            <Switch
              isChecked={scope.includes(collaboratorScope)}
              onChange={(e) => handleChange(collaboratorScope, e)}
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
        </li> */}
      </ul>
    </div>
  );
}
