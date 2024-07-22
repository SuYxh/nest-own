import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  @Transform(({ value }) => format(value, 'yyyy-MM-dd HH:mm:ss'), {
    toClassOnly: true,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => format(value, 'yyyy-MM-dd HH:mm:ss'), {
    toClassOnly: true,
  })
  updatedAt: Date;
}
