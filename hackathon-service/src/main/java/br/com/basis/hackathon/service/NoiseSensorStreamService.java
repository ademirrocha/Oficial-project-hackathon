package br.com.basis.hackathon.service;

import br.com.basis.hackathon.domain.avro.NoiseSensor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.function.Consumer;

@Slf4j
@RequiredArgsConstructor
public class NoiseSensorStreamService implements Consumer<NoiseSensor> {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    @MessageMapping("/noise")
    public void accept(NoiseSensor noise) {
        simpMessagingTemplate.convertAndSend("/topic/noises", br.com.basis.hackathon.domain.NoiseSensor
                .builder()
                .sensor(noise.getSensor())
                .latitude(noise.getLatitude())
                .longitude(noise.getLongitude())
                .volume(noise.getVolume())
                .frequency(noise.getFrequency())
                .build());
    }

}
