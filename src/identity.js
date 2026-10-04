export const validIdentity = (identity) =>
  ["fullName", "nim", "className"].every(
    (k) =>
      typeof identity?.[k] === "string" &&
      identity[k].trim().length > 0 &&
      identity[k].length <= 120,
  );
export const readIdentity = (form) =>
  Object.fromEntries(
    ["fullName", "nim", "className"].map((k) => [
      k,
      String(new FormData(form).get(k) || "").trim(),
    ]),
  );
