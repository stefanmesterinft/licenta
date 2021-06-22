import {MigrationInterface, QueryRunner} from "typeorm";

export class customersChanges1599130710641 implements MigrationInterface {
    name = 'customersChanges1599130710641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "password"`);
        await queryRunner.query(`CREATE TYPE "customers_type_enum" AS ENUM('CLIENT', 'TESTER')`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "type" "customers_type_enum" NOT NULL DEFAULT 'CLIENT'`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "subtype" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "subtype"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "customers_type_enum"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "password" character varying`);
    }

}
