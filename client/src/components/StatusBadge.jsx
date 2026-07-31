import { BOOKING_STATUS_STYLES } from "../constants";
import { useLanguage } from "../context/LanguageContext";
export default function StatusBadge({
  status
}) {
  const { t } = useLanguage();
  const style = BOOKING_STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
  const label = t(`status_${status}`);
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}>
      {label === `status_${status}` ? status : label}
    </span>;
}