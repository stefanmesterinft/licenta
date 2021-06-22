import {MigrationInterface, QueryRunner} from "typeorm";

export class FixesForTables1600766058033 implements MigrationInterface {
    name = 'FixesForTables1600766058033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c27ae6c32889a2290cf143f6ae"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d87b4c0088efd3ec77473b0a73" ON "users" ("social_security_number") WHERE social_security_number IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d87b4c0088efd3ec77473b0a73"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c27ae6c32889a2290cf143f6ae" ON "users" ("social_security_number") WHERE (social_security_number IS NOT NULL)`);
    }

}
