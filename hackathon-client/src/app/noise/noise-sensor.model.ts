
export class NoiseColor {
    constructor(public begin: number, public end: number, public color: string) {}
}

export const noiseColors: NoiseColor[] = [
    new NoiseColor(90, 194, "FF3933"), 
    new NoiseColor(70, 90, "FFF933"), 
    new NoiseColor(25, 70, "3FFF33"), 
    new NoiseColor(0, 25, "3386FF") ]


export class NoiseSensor {

    constructor(
        public sensor?: number, 
        public latitude?: number, 
        public longitude?: number, 
        public frequency?: number, 
        public volume?: number) {}

    get title(): string {
        return `Sensor #${this.sensor}`;
    }

    get markerPosition(): google.maps.LatLngLiteral {
        return { lat: this.latitude, lng: this.longitude };
    }

    get markerOptions(): google.maps.MarkerOptions {
        var pinColor = this.noiseColor;
        return { icon: { 
            url: `http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|${pinColor}|14|b|${this.sensor}`,
            anchor: new google.maps.Point(10, 34)
        }};
    }

    get noiseColor(): string {
        return noiseColors
            .filter((noise: NoiseColor) => this.volume >= noise.begin && this.volume < noise.end)[0].color;
    }

}