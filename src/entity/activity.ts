import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { ActivityItem } from "./activity-item";

@Entity()
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  creationDate!: string;

  @OneToMany(() => ActivityItem, (item) => item.activity)
  items!: ActivityItem[];
}
