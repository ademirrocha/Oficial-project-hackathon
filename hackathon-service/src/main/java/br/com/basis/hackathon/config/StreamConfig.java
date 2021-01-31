package br.com.basis.hackathon.config;

import br.com.basis.hackathon.domain.avro.NoiseSensor;
import br.com.basis.hackathon.service.NoiseSensorStreamService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.function.Consumer;

@Configuration
public class StreamConfig {

    @Bean
    public Consumer<NoiseSensor> noiseSensorConsumer(SimpMessagingTemplate simpMessagingTemplate)  {
        return new NoiseSensorStreamService(simpMessagingTemplate);
    }

}
