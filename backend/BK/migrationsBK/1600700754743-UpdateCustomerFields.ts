import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCustomerFields1600700754743 implements MigrationInterface {
    name = 'UpdateCustomerFields1600700754743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "ein" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_0041b65f12b403568eb1528cbde" UNIQUE ("ein")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "clia" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_5ca3c5e66bf5a51ad3714dccd66" UNIQUE ("clia")`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point)`);
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tests" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "samples" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "devices" ALTER COLUMN "location" TYPE geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_5ca3c5e66bf5a51ad3714dccd66"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "clia"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_0041b65f12b403568eb1528cbde"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "ein"`);
    }

}
