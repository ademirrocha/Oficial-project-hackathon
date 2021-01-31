# Hackathon online do IFNMG do Campus Arinos

## Desafio

O desafio pode ser acessado no seguinte [endereço](desafio/desafio-iot-ifnmg-basis.md).

## Docker

Para instalar o docker engine seguir as [instruções](https://docs.docker.com/engine/install/).

Para instalar o docker compose seguir as [instruções](https://docs.docker.com/compose/install/).

## Kafka

Para iniciar o Kafka

```
docker-compose up broker connect control-center schema_registry zookeeper
```

Endereços:

* [Zookeeper](http://localhost:2181)
* [Kafka broker](http://localhost:9092)
* [Schema Registry](http://localhost:8081)
* [Kafka connect](http://localhost:8083)
* [Control Center](http://localhost:9021)


### Simulação de dados dos sensores

Os dados dos sensores no exemplo são coletados e agrupados em um tópico do Kafka.

Para iniciar a simulação da coleta de dados dos sensores:

```
curl -X POST http://localhost:8083/connectors -H 'Content-Type:application/json' -H 'Accept:application/json' -d @hackathon-service/src/main/resources/avro/noise.json
```

Para parar a simulação da coleta de dados dos sensores:

```
curl -X DELETE http://localhost:8083/connectors/datagen-noise-sensor
```

Pode-se optar pelo uso de json na coleta de dados dos sensores:

```
curl -X POST http://localhost:8083/connectors -H 'Content-Type:application/json' -H 'Accept:application/json' -d @hackathon-service/src/main/resources/avro/noise-json.json
```

Para parar a simulação da coleta de dados dos sensores em json:

```
curl -X DELETE http://localhost:8083/connectors/datagen-noise-json-sensor
```

### Como fazer a integração com java com a fila do Apache Kafka

Para fazer a integração com o java pode ser usada o Spring Cloud Stream com o [Kafka Binder](https://docs.spring.io/spring-cloud-stream-binder-kafka/docs/3.1.0/reference/html/spring-cloud-stream-binder-kafka.html#_apache_kafka_binder)


Segue exemplo de configuraração do Spring Cloud Stream no application.yaml:

```
spring:
  cloud:
    stream:
      bindings:
        noiseSensorConsumer-in-0:
          destination: noise-sensor
          consumer:
            useNativeDecoding: true
      kafka:
        bindings:
          noiseSensorConsumer-in-0:
            consumer:
              configuration:
                value.deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
                schema.registry.url: http://schema_registry:8081
                specific.avro.reader: true
  kafka:
    bootstrap-servers: broker:9093


```

Exemplo de consumidor:

```
@Configuration
public class StreamConfig {

    @Bean
    public Consumer<NoiseSensor> noiseSensorConsumer(SimpMessagingTemplate simpMessagingTemplate)  {
        return new NoiseSensorStreamService(simpMessagingTemplate);
    }

}
```

```
public class NoiseSensorStreamService implements Consumer<NoiseSensor> {

    @Override
    public void accept(NoiseSensor noise) {
        System.out.println(noise.getSensor());
    }

}
```

### Como fazer a integração com php com a fila do Apache Kafka

Para fazer a integração com o php pode ser usada o [PHP Client](https://github.com/EVODelavega/phpkafka) com a geração de eventos em json.

## Projeto de exemplo

Para iniciar o Projeto de exemplo

```
docker-compose up hackathon-service
docker-compose up hackathon-client
```

Endereços:

* [Client](http://localhost:4200)
* [Service](http://localhost:8080)

## Elasticsearch e Kibana

O Elasticsearch com o Kibana pode ser usado para a visualização dos dados e armazenamento dos dados

```
docker-compose up elasticsearch kibana
```

Endereços:

* [Elasticsearch](http://localhost:9200)
* [Kibana](http://localhost:5601)

## Documentação

Tecnologias:

* [@angular](https://angular.io/docs)
* [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
* [Spring Cloud Stream](https://docs.spring.io/spring-cloud-stream/docs/3.1.0/reference/html/)
* [Apache Kafka](https://kafka.apache.org/documentation/)

Outros clientes do Apache Kafka:

* [Apache Kafka Clients](https://cwiki.apache.org/confluence/display/KAFKA/Clients#Clients-ClientLibrariesPreviouslySupported)
* [Apache Kafka Confluence Clients](https://docs.confluent.io/platform/current/clients/index.html)
