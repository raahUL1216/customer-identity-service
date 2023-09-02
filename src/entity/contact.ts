import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Check,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('contacts')
@Check(`"linkPrecedence" IN ('primary', 'secondary')`)
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string | null;

    @Column({ type: 'int', nullable: true })
    linkedId: number | null;

    @Column({ type: 'int', nullable: true })
    parentId: number | null;

    @Column({ type: 'enum', enum: ['primary', 'secondary'] })
    linkPrecedence: 'primary' | 'secondary';

    @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp without time zone' })
    updatedAt: Date;

    @Column({ type: 'timestamp without time zone', nullable: true })
    deletedAt: Date | null;
}
