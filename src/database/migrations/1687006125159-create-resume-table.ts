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

export class CreateResumeTable1687006125159 implements MigrationInterface {
  name = 'CreateResumeTable1687006125159';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resume',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'age',
            type: 'int',
          },
          {
            name: 'profilePicture',
            type: 'varchar',
            isNullable: true,
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
        'resume',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('resume')) as Table;
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('resume', foreignKey);
    await queryRunner.dropTable('resume');
  }
}
