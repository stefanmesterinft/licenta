import {MigrationInterface, QueryRunner} from "typeorm";

export class updateFields1599037724736 implements MigrationInterface {
    name = 'updateFields1599037724736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_104be41d064fe41bec0fc0e74db" UNIQUE ("social_security_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_104be41d064fe41bec0fc0e74db"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    }
}
