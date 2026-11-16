import { api } from "../config/axios";

export function markRecordViewed(entity, id) {
  if (!id) return;
  api.post(`/${entity}/${id}/view`).catch((error) => {
    console.error("Failed to record that this record was opened:", error);
  });
}
