import { Component, Input } from '@angular/core';
import { NoiseSensor } from './noise-sensor.model';

@Component({
    selector: 'noise-sensor',
    templateUrl: './noise-sensor.component.html'
})
export class NoiseSensorComponent {

    @Input()
    sensor: NoiseSensor;

}
