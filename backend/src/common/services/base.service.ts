import { Injectable, BadRequestException } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { isObject, isPlainObject, isArray, isNull } from 'lodash';
import { createReadStream, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export abstract class BaseService {
    protected abstract _getRepository();

    protected _getFiltersList(filters: Map<string, Record<string, any>>): any {
        const filtersList: any = {};

        return filtersList;
    }

    async countRecords(filters?: Map<string, any>): Promise<number> {
        const filtersList = this._getFiltersList(filters);
        return this._getRepository().count(filtersList);
    }

    textSearch(qb, value, fields=[]): void {
        if(!fields) return;
        if(!value) return;

        const texts = value.split(" ");
        qb.andWhere(new Brackets(sqb => {
            fields.forEach(field => {
                sqb.orWhere(`${field} ILIKE :q`, {q:`%${value}%`});
                if(texts.length > 1){
                    texts.forEach((text,i)=>{
                        sqb.orWhere(`${field} ILIKE :q${i}`, {[`q${i}`]:`%${text}%`});
                    });
                }
            });
        }));
    }

    private _columnSubfilter(sqb, field: string, filter: any | any[], useOR?: boolean){
        if(isArray(filter)){
            this.columnFilter(sqb, filter, true);
        } else if (isPlainObject(filter)) {
            if (filter.hasOwnProperty('start') || filter.hasOwnProperty('end')) {
                if (filter.hasOwnProperty('start')) {
                    sqb.andWhere(`${field} ::timestamp  >= :${field.replace(".","")}Start::timestamp `, { [field.replace(".","") + 'Start']: filter.start });
                }

                if (filter.hasOwnProperty('end')) {
                    sqb.andWhere(`${field} ::timestamp <= :${field.replace(".","")}End::timestamp `, { [field.replace(".","") + 'End']: filter.end });
                }
            }else{
                this.columnFilter(sqb, filter);
            }
        }else{
            let query = `${field} = :${field}`;
            let queryParams = { [field]: filter };

            if(isNull(filter) || filter === "null"){
                query = `${field} is NULL`;
                queryParams = {};
            }

            if(useOR){
                sqb.orWhere(query, queryParams);
            }else{
                sqb.andWhere(query, queryParams);
            }
        }
    }

    columnFilter(qb, filters: any | any[], useOR?: boolean): void {
        if(!filters) return;
        if(!Object.keys(filters).length) return;

        Object.keys(filters).forEach((field) => {
            const filter = filters[field];
            if(useOR){
                qb.orWhere(new Brackets(sqb => {
                    this._columnSubfilter(sqb, field, filter, true);
                }));
            }else{
                qb.andWhere(new Brackets(sqb => {
                    this._columnSubfilter(sqb, field, filter, true);
                }));
            } 
        });
    }

    columnSort(qb, sorts: any, tableName: string): void {
        if( Object.keys(sorts).length > 0){
            qb.addOrderBy(sorts);
        }else if(tableName){
            qb.addOrderBy(tableName + ".createdAt", 'DESC');
        }
    }


    async defaultImporter(csvParser, entityTarget: any, file: any): Promise<boolean> {
        const filepath = join(__dirname,'../../../',file.path);
        if(existsSync(filepath)){
            const stream = createReadStream(filepath)

            const entities = await csvParser.parse(stream, entityTarget, null, null, { strict: true, separator: ',' });

            if(entities && entities.list){
                const data = await this._getRepository().createQueryBuilder()
                .insert()
                .into(entityTarget)
                .values(entities.list)
                .execute();
            }else{
                throw new BadRequestException('error.csv_parse.can_not_parse');
            }

            unlinkSync(filepath);
        }
     
        return true;
    }
}
