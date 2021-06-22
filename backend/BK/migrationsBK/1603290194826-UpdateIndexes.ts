import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateIndexes1603290194826 implements MigrationInterface {
    name = 'UpdateIndexes1603290194826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_9293230eaedf678d401f3b5ab5"`);
        await queryRunner.query(`DROP INDEX "IDX_6d6ce1e5d0a5be43f78fe6bf03"`);
        await queryRunner.query(`DROP INDEX "IDX_e9c643be982c348e0803283d92"`);
        await queryRunner.query(`DROP INDEX "IDX_dc60b20042db68c22b24b505d5"`);
        await queryRunner.query(`DROP INDEX "IDX_e08271725e782288f0c77c64ae"`);
        await queryRunner.query(`DROP INDEX "IDX_3c5cb8e03d0fbe116336d5aec3"`);
        await queryRunner.query(`DROP INDEX "IDX_e2e43dc1dd74a3ca2afb3bfbca"`);
        await queryRunner.query(`DROP INDEX "IDX_40fe4a91604082df5c0eeb8b49"`);
        await queryRunner.query(`DROP INDEX "IDX_ea4eb2db9fae426d0133035116"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a9fe1e0f1b340fd3efde1f400a" ON "customers" ("ein") WHERE (ein != '' and ein IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78c0173ebc23be4a4ceec31883" ON "customers" ("clia") WHERE (clia != '' and clia IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9a7deaf41ba532e0880aa46abb" ON "customers" ("email") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_66523bde870a19f0e1e4b3dec1" ON "devices" ("identifier") WHERE (identifier != '' and identifier IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b96d51fea53a14365c096d87d1" ON "devices" ("barcode") WHERE (barcode != '' and barcode IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_94ee5b658432a1613b7be88960" ON "samples" ("identifier") WHERE (identifier != '' and identifier IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_255fe40c5cf45e425610229e0a" ON "samples" ("barcode") WHERE (barcode != '' and barcode IS NOT NULL and deleted_at is NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_67db82a4d28b9efac01f03b2d5" ON "users" ("email") WHERE deleted_at is NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bdac8cb57672642e1ea83ad18d" ON "users" ("social_security_number") WHERE (social_security_number != '' and social_security_number IS NOT NULL and deleted_at is NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_bdac8cb57672642e1ea83ad18d"`);
        await queryRunner.query(`DROP INDEX "IDX_67db82a4d28b9efac01f03b2d5"`);
        await queryRunner.query(`DROP INDEX "IDX_255fe40c5cf45e425610229e0a"`);
        await queryRunner.query(`DROP INDEX "IDX_94ee5b658432a1613b7be88960"`);
        await queryRunner.query(`DROP INDEX "IDX_b96d51fea53a14365c096d87d1"`);
        await queryRunner.query(`DROP INDEX "IDX_66523bde870a19f0e1e4b3dec1"`);
        await queryRunner.query(`DROP INDEX "IDX_9a7deaf41ba532e0880aa46abb"`);
        await queryRunner.query(`DROP INDEX "IDX_78c0173ebc23be4a4ceec31883"`);
        await queryRunner.query(`DROP INDEX "IDX_a9fe1e0f1b340fd3efde1f400a"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ea4eb2db9fae426d0133035116" ON "users" ("social_security_number") WHERE (((social_security_number)::text <> ''::text) AND (social_security_number IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_40fe4a91604082df5c0eeb8b49" ON "users" ("email") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e2e43dc1dd74a3ca2afb3bfbca" ON "samples" ("barcode") WHERE (((barcode)::text <> ''::text) AND (barcode IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3c5cb8e03d0fbe116336d5aec3" ON "samples" ("identifier") WHERE (((identifier)::text <> ''::text) AND (identifier IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e08271725e782288f0c77c64ae" ON "devices" ("barcode") WHERE (((barcode)::text <> ''::text) AND (barcode IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dc60b20042db68c22b24b505d5" ON "devices" ("identifier") WHERE (((identifier)::text <> ''::text) AND (identifier IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e9c643be982c348e0803283d92" ON "customers" ("email") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6d6ce1e5d0a5be43f78fe6bf03" ON "customers" ("clia") WHERE (((clia)::text <> ''::text) AND (clia IS NOT NULL) AND (deleted_at IS NULL))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9293230eaedf678d401f3b5ab5" ON "customers" ("ein") WHERE (((ein)::text <> ''::text) AND (ein IS NOT NULL) AND (deleted_at IS NULL))`);
    }

}
