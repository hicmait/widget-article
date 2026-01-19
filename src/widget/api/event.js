import axios from "axios";

export const getEvent = ({ ttpApiUrl, token, eventId }) => {
  const fields = [
    "id",
    "type",
    "nameFr",
    "nameNl",
    "nameEn",
    "placeFr",
    "placeNl",
    "placeEn",
    "descriptionFr",
    "descriptionNl",
    "descriptionEn",
    "urlBannerFr",
    "urlBannerNl",
    "urlBannerEn",
    "eventDate",
    "slotsCount",
    "client",
    "memberPrice",
    "nonMemberPrice",
    "languages",
    "isReplayable",
    "accreditationHours",
    "status",
    "replayStatus",
    "labelFr",
    "labelNl",
    "labelEn",
    "speakers-abstract",
    "user-registered",
    "eventCycles",
    "maxNumber",
    "contactFr",
    "contactNl",
    "contactEn",
    "emailContactFr",
    "emailContactNl",
    "emailContactEn",
    "phoneNumberContactFr",
    "phoneNumberContactNl",
    "phoneNumberContactEn",
    "tag",
    "slotIds",
  ];
  const requestUrl = `${ttpApiUrl}/event/event`;

  const filter = [{ property: "id", value: eventId, operator: "eq" }];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};
