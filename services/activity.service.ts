import { activityRepository } from "@/repositories/activity.repository";

export class ActivityService {
  async getLatestActivities() {
    return activityRepository.findLatest();
  }
}

export const activityService = new ActivityService();