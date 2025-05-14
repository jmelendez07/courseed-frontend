import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/es';

dayjs.locale('es');
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);