import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity({ name: 'Contact' })
  export class PipelineTask {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    phoneNumber: string;
    
    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    linkedId:number;

    @Column()
    linkPrecedence :string;
  
    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
    
    @Column({ nullable: true })
    deletedAt: Date;
  }
  