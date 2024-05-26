import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { ReadOnlyConsumerService } from './read-only.consumer';

@Module({
  providers: [ProducerService, ConsumerService, ReadOnlyConsumerService],
  exports: [ProducerService, ConsumerService, ReadOnlyConsumerService],
})
export class KafkaModule {}
