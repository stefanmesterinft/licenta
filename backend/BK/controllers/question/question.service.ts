import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { QuestionsPageDto } from './dto/QuestionsPage.dto';
import { QuestionsPageOptionsDto } from './dto/QuestionsPageOptions.dto';
import { QuestionEntity } from './question.entity';
import { QuestionRepository } from './question.repository';
import { QuestionUpdateDto } from './dto/QuestionUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { QuestionCreateDto } from './dto/QuestionCreate.dto';
import { QuestionsTypeaheadPageDto } from './dto/QuestionsTypeaheadPage.dto';
import { QuestionDto } from './dto/Question.dto';

@Injectable()
export class QuestionService extends BaseService {
    constructor(
        public readonly questionRepository: QuestionRepository,
        public readonly validatorService: ValidatorService
    ) {
        super();
    }

    protected _getRepository(): Repository<QuestionEntity> {
        return this.questionRepository;
    }

    /**
     * Find single question
     */
    findOne(findData: Partial<QuestionEntity>, authUser?: UserEntity): Promise<QuestionEntity> {
        return this.questionRepository.findOne(findData, { 
            relations: ["parent", "children"]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<QuestionEntity> {
        const question = await this.findOne({id: id}, authUser);

        return question;
    }

    async createQuestion(questionDto: QuestionCreateDto): Promise<QuestionEntity> {
        const question = this.questionRepository.create(questionDto);
        return this.questionRepository.save(question);
    }

    async getQuestions(pageOptionsDto: QuestionsPageOptionsDto, authUser: UserEntity): Promise<QuestionsPageDto> {
        const queryBuilder = this.questionRepository.createQueryBuilder('question');

        let searchFields = ['question.question', 'question.description', 'parent.question', 'parent.description'];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "question");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("question.parent", "question.parent", "parent", "parent.id = question.parent_id")
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new QuestionsPageDto(items.toDtos(), pageMetaDto);
    }

    async getQuestionsTree(): Promise<any> {
        const bfs = function(tree, key, collection) {
            if (!tree[key] || tree[key].length === 0) return;

            tree[key] = tree[key].sort( (a,b) => (a.createdAt.getTime() - b.createdAt.getTime()));
            for (var i=0; i < tree[key].length; i++) {
                var child = new QuestionDto(tree[key][i]);
                child.parentId = tree.id || null;
                delete child.children;
                collection.push(child);
                bfs(tree[key][i], key, collection);
            }
            return;
        }

        const query = this.questionRepository.manager.getTreeRepository(QuestionEntity);
        let tree = await query.findTrees();
        const treeFlat: QuestionEntity[] = [];

        bfs({ children: tree }, "children", treeFlat);
        return treeFlat;
    }


    async getQuestionsTypeahead(
        pageOptionsDto: QuestionsPageOptionsDto
    ): Promise<QuestionsTypeaheadPageDto> {
        const queryBuilder = this.questionRepository.createQueryBuilder('question');

        this.textSearch(queryBuilder, pageOptionsDto.q, ['question.question', 'question.description']);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "question");
        
        const query = queryBuilder
            .select(["question.id as id", "question.question as name"])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    
        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });

     
        return new QuestionsTypeaheadPageDto(items, pageMetaDto);
    }

    async updateQuestion(id: string, questionData: QuestionUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<QuestionEntity> {
        if(!skipFind){
            const initialQuestion = await this.findById(id, authUser);

            if (!initialQuestion) {
                throw new NotFoundException();
            }
        }

        await this.questionRepository.save({id: id, ...questionData});

        return this.findById(id);
    }

    async deleteQuestion(id: string, authUser?: UserEntity): Promise<boolean> {
        const question = await this.findById(id, authUser);

        if (!question) {
            throw new NotFoundException();
        }

        await this.questionRepository.softRemove({id: id, delete: true});

        return true;
    }
}
