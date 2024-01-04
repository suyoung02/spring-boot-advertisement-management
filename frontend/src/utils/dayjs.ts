import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";

import "dayjs/locale/vi";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(duration);

export default dayjs;
