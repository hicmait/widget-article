import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const StaticPickers = ({ selectDate }) => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        selectDate(date);
      }}
      showTimeSelect
      inline
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};

export default StaticPickers;
