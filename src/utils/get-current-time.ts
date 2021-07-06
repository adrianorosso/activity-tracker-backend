import { format } from "date-fns";
import { convertToTimeZone } from "date-fns-timezone";

export function getCurrentTime() {
  const localDate = convertToTimeZone(new Date(), {
    timeZone: "America/Sao_Paulo",
  });
  return format(localDate, "YYYY-MM-DDTHH:mm:ss");
}
