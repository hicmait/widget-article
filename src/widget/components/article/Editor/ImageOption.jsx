import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";

import { uploadTmpMedia } from "Actions";
import { TTP_API_URL } from "Config";

import styles from "./Toolbar.module.scss";
import _ from "i18n";

export default function ImageOption(props) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);

  const handleDropImage = (acceptedFiles, rejectedFiles) => {
    let { onUploadImage } = props;
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    dispatch(
      uploadTmpMedia({ token: auth.token, data: acceptedFiles[0] })
    ).then((resp) => {
      const url = resp.payload.data.data.url;
      const startsWithHttp = url.lastIndexOf("http://", 0) === 0;
      const startsWithHttps = url.lastIndexOf("https://", 0) === 0;
      const isAbsolute = startsWithHttp || startsWithHttps;
      setUploading(false);
      onUploadImage(isAbsolute ? url : `${TTP_API_URL}/${url}`);
    });
  };

  return (
    <Dropzone
      className={`${styles.toolbar__group}`}
      title="Image"
      onDrop={(acceptedFiles, rejectedFiles) =>
        handleDropImage(acceptedFiles, rejectedFiles)
      }
      disablePreview={true}
      multiple={false}
    >
      <span className={styles.toolbar__button}>
        {!uploading ? (
          <svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M10.7098 8.71039C12.1351 8.71039 13.2946 7.55085 13.2946 6.12558C13.2946 4.70032 12.1351 3.54077 10.7098 3.54077C9.28455 3.54077 8.125 4.70032 8.125 6.12558C8.125 7.55085 9.28455 8.71039 10.7098 8.71039Z"
                fill="#6D7F92"
              />
              <path
                d="M16.9132 0.955933H1.40435C0.976098 0.955933 0.628906 1.30312 0.628906 1.73138V14.1283C0.628906 14.1289 0.628906 14.1294 0.628906 14.1299V17.2402C0.628906 17.6685 0.976098 18.0157 1.40435 18.0157H16.9132C17.3415 18.0157 17.6887 17.6685 17.6887 17.2402V1.73138C17.6887 1.30312 17.3415 0.955933 16.9132 0.955933ZM16.1378 11.7933L14.434 9.49863C14.2878 9.30161 14.0568 9.18545 13.8114 9.18545C13.566 9.18545 13.3351 9.30161 13.1889 9.49863L10.7317 12.808L6.69458 6.97658C6.54973 6.76736 6.31146 6.64252 6.05701 6.64252C5.80256 6.64252 5.56429 6.76736 5.41944 6.97658L2.17979 11.6561V2.50682H16.1378V11.7933Z"
                fill="#6D7F92"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect
                  width="17.0597"
                  height="17.0597"
                  fill="white"
                  transform="translate(0.628906 0.955933)"
                />
              </clipPath>
            </defs>
          </svg>
        ) : (
          <svg
            height="18"
            viewBox="0 0 48 48"
            width="19"
            className="ed-img-rotating"
          >
            <path
              d="M42.28,11.851C38.238,5.42,31.105,1.135,22.95,1.135c-10.888,0-19.97,7.621-22.272,17.813  c-0.009,0-0.015-0.003-0.024-0.003c-0.018,0.104-0.027,0.2-0.044,0.302c-0.113,0.536-0.205,1.078-0.28,1.626l-0.022-0.024  c0,0-0.06,0.407-0.115,1.075c-0.005,0.057-0.018,0.113-0.022,0.17h0.009c-0.146,1.901-0.22,5.65,1.003,8.858  c0.006,0.016,0.012,0.029,0.018,0.045c0.209,0.671,0.434,1.29,0.66,1.835l0.008-0.008c0.486,1.202,0.891,1.856,0.891,1.856h0.01  c3.835,7.238,11.417,12.184,20.18,12.184c10.212,0,18.836-6.707,21.769-15.948h-4.018c-2.77,7.102-9.668,12.138-17.751,12.138  c-6.564,0-12.33-3.333-15.751-8.387l-0.007,0.014c0,0-0.049-0.078-0.128-0.214c-0.345-0.524-0.659-1.07-0.954-1.626  c-0.456-1.05-2.626-6.417-1.992-11.603c0.037-0.252,0.065-0.507,0.111-0.755c0.024-0.137,0.055-0.273,0.084-0.409  c1.811-8.638,9.46-15.128,18.638-15.128c7.108,0,13.281,3.904,16.551,9.674L32,22.095h4.407H37.5h4.408h3.821H47.9v-10.39V6.25  L42.28,11.851z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
    </Dropzone>
  );
}
