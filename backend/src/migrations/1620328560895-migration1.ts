import {MigrationInterface, QueryRunner} from "typeorm";

export class migration11620328560895 implements MigrationInterface {
    name = 'migration11620328560895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "users_roles_enum" RENAME TO "users_roles_enum_old"`);
        await queryRunner.query(`CREATE TYPE "users_roles_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "users_roles_enum"[] USING "roles"::"text"::"users_roles_enum"[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{USER}'`);
        await queryRunner.query(`DROP TYPE "users_roles_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "users_roles_enum_old" AS ENUM('USER', 'TESTER', 'TESTER_MONITOR', 'TESTER_ADMIN', 'CLIENT', 'ADMIN', 'DEVICE', 'VERIFIER')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "users_roles_enum_old"[] USING "roles"::"text"::"users_roles_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{USER}'`);
        await queryRunner.query(`DROP TYPE "users_roles_enum"`);
        await queryRunner.query(`ALTER TYPE "users_roles_enum_old" RENAME TO "users_roles_enum"`);
    }

}
