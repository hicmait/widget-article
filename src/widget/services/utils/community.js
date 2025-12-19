import { COMMUNITY_NAME_MAX_LENGTH } from "../config";
import { slugify, addLandaSize } from "../utils";

export const getCommunityDisplayName = (community) => {
  if (!community) {
    return "";
  }
  return (
    community.abbreviation ||
    (community.name.length <= COMMUNITY_NAME_MAX_LENGTH
      ? community.name
      : community.name.substring(0, COMMUNITY_NAME_MAX_LENGTH) + " ...")
  );
};

export const getCommunityRoute = (community) => {
  if (!community) {
    return "";
  }
  return `/community/${
    community.url ? community.url : slugify(community.name)
  }/${community.id}`;
};

export const getAllowedMediaTypes = (community) => {
  if (!community) {
    return getAllAllowedMediaTypes();
  }
  if (
    community &&
    community.mediaSettings &&
    community.mediaSettings.preferences &&
    community.mediaSettings.preferences.generalTypes
  ) {
    return community.mediaSettings.preferences.generalTypes.split(",");
  }

  return [];
};

export const getAllAllowedMediaTypes = () => {
  return ["IMAGE", "VIDEO", "PDF", "PPT"];
};

export const getAllowedLanguages = (community) => {
  if (
    community &&
    community.mediaSettings &&
    community.mediaSettings.preferences &&
    community.mediaSettings.preferences.languages
  ) {
    return community.mediaSettings.preferences.languages.split(",");
  }

  return [];
};

export const getUserMediaRole = (community, type) => {
  if (community && community.mediaSettings && community.mediaSettings.roles) {
    return community.mediaSettings.roles[`${type.toLowerCase()}Role`];
  }

  return null;
};

export const getUserAllowedLanguages = (community) => {
  if (
    community &&
    community.mediaSettings &&
    community.mediaSettings.roles &&
    community.mediaSettings.roles.preferences &&
    community.mediaSettings.roles.preferences.languages
  ) {
    return community.mediaSettings.roles.preferences.languages.split(",");
  }

  return getAllowedLanguages(community);
};
