import { BOOKING_STATUS_STYLES } from "../constants";
export default function StatusBadge({
  status
}) {
  const style = BOOKING_STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}>
      {status}
    </span>;
}