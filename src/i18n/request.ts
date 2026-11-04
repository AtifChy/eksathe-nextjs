import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { getLocaleOrDefault, localeCookieName } from "./locales";

export default getRequestConfig(async () => {
  const savedLocale = (await cookies()).get(localeCookieName)?.value;
  const locale = getLocaleOrDefault(savedLocale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Asia/Dhaka",
  };
});
