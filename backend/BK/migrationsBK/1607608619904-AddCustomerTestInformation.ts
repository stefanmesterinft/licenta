import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomerTestInformation1607608619904 implements MigrationInterface {
    name = 'AddCustomerTestInformation1607608619904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "test_introduction" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "test_introduction"`);
    }

}
