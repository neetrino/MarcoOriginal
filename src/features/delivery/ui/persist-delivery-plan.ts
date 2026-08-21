import {
  createDeliveryLocationAction,
  deleteDeliveryLocationAction,
  updateDeliveryLocationAction,
} from "@/features/delivery/application/manage-delivery";
import type { DeliverySavePlan } from "@/features/delivery/ui/delivery-location-draft";
import { ok, type Result } from "@/lib/result";

/** Applies a planned create / update / delete batch through existing actions. */
export async function persistDeliveryPlan(
  locale: string,
  plan: DeliverySavePlan,
): Promise<Result<void>> {
  for (const id of plan.toDelete) {
    const result = await deleteDeliveryLocationAction(locale, id);
    if (!result.ok) return result;
  }

  for (const input of plan.toCreate) {
    const result = await createDeliveryLocationAction(locale, input);
    if (!result.ok) return result;
  }

  for (const item of plan.toUpdate) {
    const result = await updateDeliveryLocationAction(
      locale,
      item.id,
      item.input,
    );
    if (!result.ok) return result;
  }

  return ok(undefined);
}
