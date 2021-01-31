import { Component, OnInit, ViewChild } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { NoiseSensor } from './noise-sensor.model';

import { environment } from '../../environments/environment';

@Component({
    selector: 'noise-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

    apiLoaded: Observable<boolean>;
    center: google.maps.LatLngLiteral = environment.googlemaps.center;
    zoom = environment.googlemaps.zoom;

    sensors: NoiseSensor[] = [];
    selectedSensor: NoiseSensor = new NoiseSensor(1,0,0,0,0);

    constructor(private rxStompService: RxStompService, private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.apiLoaded = this.httpClient.jsonp(environment.googlemaps.url, 'callback')
            .pipe(map(() => true), catchError(() => of(false)));
        this.rxStompService.watch('/topic/noises').subscribe((message: any) => {
            let sensor: NoiseSensor = JSON.parse(message.body);
            let marker = this.sensors.filter((value) => value.sensor === sensor.sensor);
            if (marker.length > 0) {
                Object.assign(marker[0], sensor);
            } else {
                this.sensors.push(Object.assign(new NoiseSensor(), sensor));
            }
        });
    }

    openInfoWindow(sensor: NoiseSensor, marker: MapMarker) {
        this.selectedSensor = sensor;
        this.infoWindow.open(marker);
    }

}
