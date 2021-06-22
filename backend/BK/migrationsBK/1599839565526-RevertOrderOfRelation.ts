import {MigrationInterface, QueryRunner} from "typeorm";

export class RevertOrderOfRelation1599839565526 implements MigrationInterface {
    name = 'RevertOrderOfRelation1599839565526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs_testers_users" ("jobs_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_d89aba7c40d35aee97658bed736" PRIMARY KEY ("jobs_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91e64da2884d29755f74873418" ON "jobs_testers_users" ("jobs_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_df0484ab384a24f15a5fa7c189" ON "jobs_testers_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "jobs_testers_users" ADD CONSTRAINT "FK_91e64da2884d29755f748734184" FOREIGN KEY ("jobs_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs_testers_users" ADD CONSTRAINT "FK_df0484ab384a24f15a5fa7c1893" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs_testers_users" DROP CONSTRAINT "FK_df0484ab384a24f15a5fa7c1893"`);
        await queryRunner.query(`ALTER TABLE "jobs_testers_users" DROP CONSTRAINT "FK_91e64da2884d29755f748734184"`);
        await queryRunner.query(`DROP INDEX "IDX_df0484ab384a24f15a5fa7c189"`);
        await queryRunner.query(`DROP INDEX "IDX_91e64da2884d29755f74873418"`);
        await queryRunner.query(`DROP TABLE "jobs_testers_users"`);
    }

}
