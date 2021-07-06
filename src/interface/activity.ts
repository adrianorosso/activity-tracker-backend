import { ActivityItem } from "../entity/activity-item";

export interface IActivity {
  name: string;
  description: string;
  creationDate: string;
  items: ActivityItem[];
}
