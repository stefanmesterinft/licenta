import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1619168764464 implements MigrationInterface {
    name = 'Init1619168764464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "users_roles_enum" AS ENUM('USER', 'TESTER', 'TESTER_MONITOR', 'TESTER_ADMIN', 'CLIENT', 'ADMIN', 'DEVICE', 'VERIFIER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying, "last_name" character varying, "roles" "users_roles_enum" array NOT NULL DEFAULT '{USER}', "email" character varying NOT NULL, "email_confirmed" boolean DEFAULT false, "password" character varying, "phone" character varying, "phone_confirmed" boolean DEFAULT false, "avatar" character varying, "cover" character varying, "middle_name" character varying, "date_of_birth" TIMESTAMP, "social_security_number" character varying, "address1" character varying, "address2" character varying, "city" character varying, "state" character varying, "postal_code" character varying, "about" character varying, "sex" character varying, "race_ethnicity" character varying, "suspended_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_67db82a4d28b9efac01f03b2d5" ON "users" ("email") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_912ea7e67e2c7ef4398f08be5f" ON "users" ("phone") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bdac8cb57672642e1ea83ad18d" ON "users" ("social_security_number") WHERE (social_security_number != '' and social_security_number IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE TABLE "audits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "action" character varying, "description" character varying, "entity_name" character varying, "entity_id" character varying, "user_id" uuid, CONSTRAINT "PK_b2d7a2089999197dc7024820f28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying, "token" character varying, CONSTRAINT "PK_b985a8362d9dac51e3d6120d40e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_forgot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying, "token" character varying, CONSTRAINT "PK_96a7e070a9c539f26f1ab40ad77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phone_verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "phone" character varying, "token" character varying, CONSTRAINT "PK_028d02e37d668b794d82247591b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "messages_type_enum" AS ENUM('CONTACT', 'SUPPORT', 'INTERN')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "message" character varying NOT NULL, "name" character varying, "phone" character varying, "location" character varying, "type" "messages_type_enum" NOT NULL DEFAULT 'CONTACT', CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "value" character varying NOT NULL, "description" character varying, "options" text, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audits" ADD CONSTRAINT "FK_96b1bc5c4ff586cff3f85bc91fb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audits" DROP CONSTRAINT "FK_96b1bc5c4ff586cff3f85bc91fb"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "messages_type_enum"`);
        await queryRunner.query(`DROP TABLE "phone_verification"`);
        await queryRunner.query(`DROP TABLE "password_forgot"`);
        await queryRunner.query(`DROP TABLE "email_verification"`);
        await queryRunner.query(`DROP TABLE "audits"`);
        await queryRunner.query(`DROP INDEX "IDX_bdac8cb57672642e1ea83ad18d"`);
        await queryRunner.query(`DROP INDEX "IDX_912ea7e67e2c7ef4398f08be5f"`);
        await queryRunner.query(`DROP INDEX "IDX_67db82a4d28b9efac01f03b2d5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_roles_enum"`);
    }

}
