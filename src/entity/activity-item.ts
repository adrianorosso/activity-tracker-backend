import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Activity } from "./activity";

@Entity()
export class ActivityItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startTime!: string;

  @Column({ nullable: true })
  endTime!: string;

  @Column({ nullable: true })
  duration!: string;

  @ManyToOne(() => Activity, (activity) => activity.items)
  activity!: Activity;
}
