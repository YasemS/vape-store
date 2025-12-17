import TimeAgoBase from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgoBase.addDefaultLocale(en);

type TimeAgoProps = {
  date: Date;
};

export default function TimeAgo({ date }: TimeAgoProps) {
  return <ReactTimeAgo date={date} />;
}
