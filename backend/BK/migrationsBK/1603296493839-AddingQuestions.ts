import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingQuestions1603296493839 implements MigrationInterface {
    name = 'AddingQuestions1603296493839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "questions_answer_type_enum" AS ENUM('DATETIME', 'NUMBER', 'TEXT', 'DROPDOWN', 'CHECKBOX', 'RADIO')`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "question" character varying NOT NULL, "description" character varying, "answer_type" "questions_answer_type_enum" NOT NULL DEFAULT 'TEXT', "answers" text DEFAULT '[]', "parent_id" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_5f4b1514be0b737b652d3f0bb93" FOREIGN KEY ("parent_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_5f4b1514be0b737b652d3f0bb93"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TYPE "questions_answer_type_enum"`);
    }

}
