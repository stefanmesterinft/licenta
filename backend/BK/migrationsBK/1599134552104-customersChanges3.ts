import {MigrationInterface, QueryRunner} from "typeorm";

export class customersChanges31599134552104 implements MigrationInterface {
    name = 'customersChanges31599134552104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "subtype" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "subtype" SET DEFAULT 'INDIVIDUAL'`);
    }

}
