import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateWorkExperienceTable1687146812790
  implements MigrationInterface
{
  name = 'CreateWorkExperienceTable1687146812790';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'work_experience',
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
            name: 'jobTitle',
            type: 'varchar',
          },
          {
            name: 'jobDescription',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'company', type: 'varchar', length: '255', isNullable: true },
          {
            name: 'companyLogo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'startDate',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'endDate',
            type: 'datetime',
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

    await queryRunner.createForeignKey(
      'work_experience',
      new TableForeignKey({
        columnNames: ['resumeId'],
        referencedTableName: 'resume',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('work_experience')) as Table;
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('resumeId') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('work_experience', foreignKey);
    await queryRunner.dropTable('work_experience');
  }
}
