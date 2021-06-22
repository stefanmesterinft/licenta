import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewUserFields1602689804624 implements MigrationInterface {
    name = 'AddNewUserFields1602689804624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d87b4c0088efd3ec77473b0a73"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "sex" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "race_ethnicity" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b4ad3c877c741d70e2f08ec126" ON "users" ("social_security_number") WHERE (social_security_number != '' and social_security_number IS NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_b4ad3c877c741d70e2f08ec126"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "race_ethnicity"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sex"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d87b4c0088efd3ec77473b0a73" ON "users" ("social_security_number") WHERE (social_security_number IS NOT NULL)`);
    }

}
