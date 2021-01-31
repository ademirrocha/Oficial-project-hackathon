package br.com.basis.hackathon.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoiseSensor {
    private Long sensor;
    private Double latitude;
    private Double longitude;
    private Long frequency;
    private Long volume;

}
