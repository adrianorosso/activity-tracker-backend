import { Activity } from "../entity/activity";

export interface ActivityItem {
  id: number;
  startTime: string;
  endTime: string;
  duration: string;
  activity: Activity;
}
