import {MigrationInterface, QueryRunner} from "typeorm";

export class customersChanges21599131121868 implements MigrationInterface {
    name = 'customersChanges21599131121868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "subtype"`);
        await queryRunner.query(`CREATE TYPE "customers_subtype_enum" AS ENUM('BUSINESS', 'ORGANIZATION', 'INDIVIDUAL')`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "subtype" "customers_subtype_enum" DEFAULT 'INDIVIDUAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "subtype"`);
        await queryRunner.query(`DROP TYPE "customers_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "subtype" character varying`);
    }

}
