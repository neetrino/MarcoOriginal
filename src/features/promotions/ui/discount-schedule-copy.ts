import type { AdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { DiscountScheduleCopy } from "@/features/promotions/ui/DiscountScheduleField";

/** Maps admin discounts copy into the schedule picker labels. */
export function toDiscountScheduleCopy(
  copy: AdminCopy["discounts"],
  clearLabel: string,
): DiscountScheduleCopy {
  return {
    placeholder: copy.endsAtPlaceholder,
    startTab: copy.scheduleStart,
    endTab: copy.scheduleEnd,
    timeHeading: copy.scheduleTime,
    hourLabel: copy.scheduleHour,
    minuteLabel: copy.scheduleMinute,
    apply: copy.scheduleApply,
    clear: clearLabel,
    label: copy.endsAtLabel,
  };
}
