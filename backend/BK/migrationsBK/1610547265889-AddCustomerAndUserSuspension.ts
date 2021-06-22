import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomerAndUserSuspension1610547265889 implements MigrationInterface {
    name = 'AddCustomerAndUserSuspension1610547265889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "suspended_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "suspended_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "suspended_at"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "suspended_at"`);
    }

}
