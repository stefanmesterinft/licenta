import {MigrationInterface, QueryRunner} from "typeorm";

export class ForgotAndEmailConfirmation1602604330982 implements MigrationInterface {
    name = 'ForgotAndEmailConfirmation1602604330982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying, "token" character varying, CONSTRAINT "PK_b985a8362d9dac51e3d6120d40e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_forgot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying, "token" character varying, CONSTRAINT "PK_96a7e070a9c539f26f1ab40ad77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email_confirmed" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_confirmed"`);
        await queryRunner.query(`DROP TABLE "password_forgot"`);
        await queryRunner.query(`DROP TABLE "email_verification"`);
    }

}
