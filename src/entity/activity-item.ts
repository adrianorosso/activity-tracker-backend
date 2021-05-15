import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class ActivityItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column()
  duration!: string;
}
