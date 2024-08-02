import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { ElasticsearchService } from '@nestjs/elasticsearch';
  
  @Injectable()
  export class ElasticService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}
  
    async checkElasticServiceHealth(): Promise<boolean> {
      try {
        return await this.elasticsearchService.ping();
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'An error occurred, please try again later',
        );
      }
    }
  
    async searchLogsService(query: unknown): Promise<unknown> {
      try {
        const response = await this.elasticsearchService.search(query);
  
        if (response.hits.hits === null || response.hits.hits.length === 0) {
          throw new NotFoundException('No logs found');
        }
  
        return response.hits.hits;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'An error occurred, please try again later',
        );
      }
    }
  
    async deleteLogService(query: any): Promise<unknown> {
      try {
        const response = await this.elasticsearchService.deleteByQuery(query);
        return response;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          'An error occurred, please try again later',
        );
      }
    }
  }
  