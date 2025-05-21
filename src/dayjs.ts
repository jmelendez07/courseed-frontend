import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.locale('es');
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);