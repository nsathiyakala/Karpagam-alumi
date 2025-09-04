import { useState } from "react";

export const useSetState = (initialState) => {
  const [state, setState] = useState(initialState);

  const newSetState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };
  return [state, newSetState];
};

export const objIsEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const capitalizeFLetter = (string = "") => {
  if (string.length > 0) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
};

export const Dropdown = (arr, label) => {
  const array = arr?.map((item) => ({
    value: item?.id,
    label: item[label],
  }));
  return array;
};

export const MultiDropdown = (arr, label) => {
  const array = arr?.map((item) => ({
    value: item?.id,
    name: item[label],
  }));
  return array;
};

export const UserDropdown = (arr, labelFn) => {
  const array = arr?.map((item) => ({
    value: item?.id,
    label: labelFn(item),
  }));
  return array;
};

export const getFileNameFromUrl = (url) => {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
  return filename;
};

export const convertUrlToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export const isValidImageUrl = (url) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => url?.toLowerCase().endsWith(ext));
};

export const getTimeOnly = (date) => {
  return date ? new Date(0, 0, 0, date.getHours(), date.getMinutes()) : null;
};

export const createTime = (date) => {
  const source = date ? new Date(date) : new Date(); // ensure it's a Date object

  if (isNaN(source.getTime())) {
    // fallback in case the date is invalid
    const now = new Date();
    return new Date(0, 0, 0, now.getHours(), now.getMinutes());
  }

  return new Date(0, 0, 0, source.getHours(), source.getMinutes());
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validateForm = (formData, validationRules, setErrMsg) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    if (
      rules.required &&
      (value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0))
    ) {
      errors[field] = "Enter This Field";
    } else if (rules.email && !validateEmail(value)) {
      errors[field] = "Invalid Email";
    } else if (rules.custom && !rules.custom(value)) {
      errors[field] = rules.customMessage || "Invalid value";
    } else if (rules.fileType && value && value instanceof File) {
      if (!rules.fileType.includes(value.type)) {
        errors[field] = "Invalid file type";
      }
      if (rules.fileSize && value.size > rules.fileSize) {
        errors[field] = "File is too large";
      }
    } else if (rules.phoneNumber && !validatePhoneNumber(value)) {
      errors[field] = "Invalid phone number. Must be exactly 10 digits.";
    }
  });

  setErrMsg(errors);
  return Object.keys(errors).length === 0;
};

export const modelError = (error, debug = false) => {
  if (error.response) {
    if (debug) {
      console.log("🚨 Server Error:", error.response.data);
      console.log("📌 Status Code:", error.response.status);
      console.log("📝 Headers:", error.response.headers);
    }

    return {
      type: "server",
      data: error.response.data || null,
      status: error.response.status || null,
      headers: error.response.headers || null,
    };
  } else if (error.request) {
    if (debug) {
      console.log("⚠️ No Response from Server:", error.request);
    }

    return {
      type: "no-response",
      request: error.request,
    };
  } else {
    if (debug) {
      console.log("❌ Request Setup Error:", error.message);
    }

    return {
      type: "setup",
      message: error.message,
    };
  }
};

export const objectToFormData = (obj) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};


export const viewFormData=(formData)=>{
  const arr=[]
  for (let [key, value] of formData.entries()) {
    arr.push({key,value})
  }
  return arr
}
export const setDropdownData = (data, label) => {
  const result = data?.map((item) => {
    return {
      value: item.id,
      label: item[label],
    };
  });
  return result;
};


export const ConvertFormData = (body) => {
  const formData = new FormData();
  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      const value = body[key];

      if (
        typeof value === "object" &&
        !(value instanceof File) &&
        !(value instanceof Blob)
      ) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
};


export const formattedDateTime = (data) => {
  const date = new Date(data);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit", // Hour in 2 digits
    minute: "2-digit", // Minute in 2 digits
    second: "2-digit", // Second in 2 digits
    hour12: true, // 12-hour format (AM/PM)
  });
};

export const formattedDate = (data) =>
  new Date(data).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


export const getFormattedDateTime = (start_date, start_time) => {
  if (start_date && start_time) {
    // Combine the date and time into the format YYYY-MM-DDTHH:mm
    const formattedDateTime = `${start_date}T${start_time.substring(0, 5)}`;

    console.log("Formatted DateTime:", formattedDateTime);

    return formattedDateTime; // Returns the formatted datetime string
  }
  return null; // Return null if date or time is missing
};

export const ObjIsEmpty = (object) => {
  if (object) {
    if (Object.keys(object)?.length === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const formatForGoogleCalendar = (date, time) => {
  // Combine start date and time into one string
  const startDateTime = new Date(`${date}T${time}`);

  // Convert to the format required by Google Calendar: YYYYMMDDTHHmmSSZ
  const googleCalendarTime = startDateTime
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0];

  return googleCalendarTime;
};

export const convertTo12HourFormat = (time) => {
  if (!time) return ""; // If time is not available, return an empty string

  // Parse the time into hours and minutes
  const [hours, minutes] = time.split(":");

  let hoursIn12HourFormat = parseInt(hours, 10); // Convert hours to a number
  const suffix = hoursIn12HourFormat >= 12 ? "PM" : "AM"; // Determine AM/PM
  hoursIn12HourFormat = hoursIn12HourFormat % 12; // Convert 24-hour to 12-hour format
  if (hoursIn12HourFormat === 0) hoursIn12HourFormat = 12; // Handle midnight case

  // Format the time as a string
  return `${hoursIn12HourFormat}:${minutes} ${suffix}`;
};

export const TrimText = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
