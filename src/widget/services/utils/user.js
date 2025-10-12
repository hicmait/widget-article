export const getUserNameForAvatar = (firstName, lastName) => {
  let fName = firstName.split(" ");
  if (fName.length >= 3) {
    return extractFirstLettre(fName, 3);
  } else {
    let lName = lastName.split(" ");
    return extractFirstLettre(fName.concat(lName), 3);
  }
};

function extractFirstLettre(arrayStr, length) {
  let result = "";
  for (let i = 0; i < arrayStr.length; i++) {
    if (arrayStr[i]) {
      result += arrayStr[i].substring(0, 1);
    }
  }
  return result.toUpperCase();
}

export function userHasRights(auth, media) {
  const { user, navCommunity } = auth;

  if (!user || !media) {
    return false;
  }

  if (!user.navCommunity) {
    return false;
  }

  let mediaCommunity = null;
  let communities = user.communities.filter((c) => c.id === navCommunity.id);
  if (communities.length > 0) {
    mediaCommunity = communities[0];
  }

  let userMediaRolesInMediaCommunity =
    mediaCommunity &&
    mediaCommunity.mediaSettings &&
    mediaCommunity.mediaSettings.roles
      ? mediaCommunity.mediaSettings.roles
      : null;

  let isMediaCreator = media.creator && media.creator.id === user.id;
  let isMediaPublished = media.status === "PUBLISHED";

  let isCheifEditorInMediaCommunity =
    userMediaRolesInMediaCommunity &&
    userMediaRolesInMediaCommunity[`${media.docType.toLowerCase()}Role`] ===
      "CHIEF_EDITOR";

  let isMandatedInMediaCommunity =
    userMediaRolesInMediaCommunity &&
    (userMediaRolesInMediaCommunity[`${media.docType.toLowerCase()}Role`] ===
      "REDACTOR_1" ||
      userMediaRolesInMediaCommunity[`${media.docType.toLowerCase()}Role`] ===
        "AUTHOR_1");

  let userHasRights =
    isMediaCreator ||
    isCheifEditorInMediaCommunity ||
    (isMediaPublished && isMandatedInMediaCommunity);

  return userHasRights;
}
