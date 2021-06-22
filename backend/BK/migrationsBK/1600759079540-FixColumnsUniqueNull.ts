import {MigrationInterface, QueryRunner} from "typeorm";

export class FixColumnsUniqueNull1600759079540 implements MigrationInterface {
    name = 'FixColumnsUniqueNull1600759079540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_104be41d064fe41bec0fc0e74db"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_0041b65f12b403568eb1528cbde"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_5ca3c5e66bf5a51ad3714dccd66"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c27ae6c32889a2290cf143f6ae" ON "users" ("social_security_number") WHERE "social_security_number" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c940d7d740071327b34fbb700c" ON "customers" ("ein") WHERE ein IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_20ba616462f29af801f3fcf81e" ON "customers" ("clia") WHERE clia IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_20ba616462f29af801f3fcf81e"`);
        await queryRunner.query(`DROP INDEX "IDX_c940d7d740071327b34fbb700c"`);
        await queryRunner.query(`DROP INDEX "IDX_c27ae6c32889a2290cf143f6ae"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_5ca3c5e66bf5a51ad3714dccd66" UNIQUE ("clia")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_0041b65f12b403568eb1528cbde" UNIQUE ("ein")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_104be41d064fe41bec0fc0e74db" UNIQUE ("social_security_number")`);
    }

}
