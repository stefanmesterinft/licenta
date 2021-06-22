import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUniqueFields1603285716802 implements MigrationInterface {
    name = 'UpdateUniqueFields1603285716802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c940d7d740071327b34fbb700c"`);
        await queryRunner.query(`DROP INDEX "IDX_20ba616462f29af801f3fcf81e"`);
        await queryRunner.query(`DROP INDEX "IDX_0cd3cbe3def88548f1837a653a"`);
        await queryRunner.query(`DROP INDEX "IDX_487833551a5b667627a6d3cbd9"`);
        await queryRunner.query(`DROP INDEX "IDX_b4ad3c877c741d70e2f08ec126"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "UQ_01157b829735c0b390f3bbab1c0"`);
        await queryRunner.query(`ALTER TABLE "samples" DROP CONSTRAINT "UQ_6f6e0f7b6bb8616a1e954cab41a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9293230eaedf678d401f3b5ab5" ON "customers" ("ein") WHERE (ein != '' and ein IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6d6ce1e5d0a5be43f78fe6bf03" ON "customers" ("clia") WHERE (clia != '' and clia IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e9c643be982c348e0803283d92" ON "customers" ("email") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dc60b20042db68c22b24b505d5" ON "devices" ("identifier") WHERE (identifier != '' and identifier IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e08271725e782288f0c77c64ae" ON "devices" ("barcode") WHERE (barcode != '' and barcode IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3c5cb8e03d0fbe116336d5aec3" ON "samples" ("identifier") WHERE (identifier != '' and identifier IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e2e43dc1dd74a3ca2afb3bfbca" ON "samples" ("barcode") WHERE (barcode != '' and barcode IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_40fe4a91604082df5c0eeb8b49" ON "users" ("email") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ea4eb2db9fae426d0133035116" ON "users" ("social_security_number") WHERE (social_security_number != '' and social_security_number IS NOT NULL and deleted_at is NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ea4eb2db9fae426d0133035116"`);
        await queryRunner.query(`DROP INDEX "IDX_40fe4a91604082df5c0eeb8b49"`);
        await queryRunner.query(`DROP INDEX "IDX_e2e43dc1dd74a3ca2afb3bfbca"`);
        await queryRunner.query(`DROP INDEX "IDX_3c5cb8e03d0fbe116336d5aec3"`);
        await queryRunner.query(`DROP INDEX "IDX_e08271725e782288f0c77c64ae"`);
        await queryRunner.query(`DROP INDEX "IDX_dc60b20042db68c22b24b505d5"`);
        await queryRunner.query(`DROP INDEX "IDX_e9c643be982c348e0803283d92"`);
        await queryRunner.query(`DROP INDEX "IDX_6d6ce1e5d0a5be43f78fe6bf03"`);
        await queryRunner.query(`DROP INDEX "IDX_9293230eaedf678d401f3b5ab5"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "samples" ADD CONSTRAINT "UQ_6f6e0f7b6bb8616a1e954cab41a" UNIQUE ("identifier")`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "UQ_01157b829735c0b390f3bbab1c0" UNIQUE ("identifier")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b4ad3c877c741d70e2f08ec126" ON "users" ("social_security_number") WHERE (((social_security_number)::text <> ''::text) AND (social_security_number IS NOT NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_487833551a5b667627a6d3cbd9" ON "samples" ("barcode") WHERE (barcode IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0cd3cbe3def88548f1837a653a" ON "devices" ("barcode") WHERE (barcode IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_20ba616462f29af801f3fcf81e" ON "customers" ("clia") WHERE (clia IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c940d7d740071327b34fbb700c" ON "customers" ("ein") WHERE (ein IS NOT NULL)`);
    }

}
