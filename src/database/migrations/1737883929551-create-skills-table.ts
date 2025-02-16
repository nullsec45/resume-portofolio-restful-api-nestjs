import { ConfigService } from '@nestjs/config';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export class CreateSkillsTable1737883929551 implements MigrationInterface {
    name = 'CreateSkillTable1737883929551';

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
                        name: 'resumeId',
                        type: 'int',
                    },
                    {
                        name: 'categoryId',
                        type: 'int',
                    },
                    {
                        name: 'skill',
                        type: 'varchar',
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

        // add an option to enable or disable foreign keys as planetscaledb doesn't support it
        // https://github.com/planetscale/discussion/discussions/18
        if (configService.get<string>('DB_FOREIGN_KEY') === 'true') {
          await queryRunner.createForeignKey(
            'skill',
            new TableForeignKey({
              columnNames: ['resumeId'],
              referencedTableName: 'resume',
              referencedColumnNames: ['id'],
              onDelete: 'CASCADE',
            }),
          );
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
    }

}
