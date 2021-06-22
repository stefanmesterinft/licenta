import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCustomers1600853214299 implements MigrationInterface {
    name = 'UpdateCustomers1600853214299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "avatar"`);
    }

}
