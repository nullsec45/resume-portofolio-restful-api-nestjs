import { ConfigService } from '@nestjs/config';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from 'typeorm';
import { config } from 'dotenv';

const configService = new ConfigService();

export class CreateSkillTable1738166628518 implements MigrationInterface {
    name = 'CreateSkillTable1738166628518';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
                    new Table({
                        name: 'skill',
                        columns: [
                            {
                                name: 'id', 
                                type: 'int',
                                isPrimary: true,
                                isGenerated: true,
                                generationStrategy: 'increment',
                            },
                            {
                                name: 'skill',
                                type: 'varchar',
                                isUnique: true,
                            },
                            {
                                name:'categoryId',
                                type:'int'
                            },
                            {
                                name: 'createdAt',
                                type: 'datetime',
                                precision: 6,
                                default: 'CURRENT_TIMESTAMP(6)',
                            },
                            {
                                name: 'updatedAt',
                                type: 'datetime',
                                precision: 6,
                                default: 'CURRENT_TIMESTAMP(6)',
                                onUpdate: 'CURRENT_TIMESTAMP(6)',
                            },
                        ],
                    }),
        );

        if (configService.get<string>('DB_FOREIGN_KEY') === 'true') {
            await queryRunner.createForeignKey(
                'skill',
                new TableForeignKey({
                    columnNames: ['categoryId'],
                    referencedTableName: 'category',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE',
                }),
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {            
        const table = (await queryRunner.getTable('skill')) as Table;
        const index = table.indices.find((index) =>
            index.columnNames.includes('skill'),
        ) as TableIndex;
        
        await queryRunner.dropIndex(table, index);
        await queryRunner.dropTable('user');
    }

}
