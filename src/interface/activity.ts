import { ActivityItem } from "../entity/activity-item";

export interface IActivity {
  id: number;
  name: string;
  description: string;
  creationDate: string;
  items: ActivityItem[];
}
