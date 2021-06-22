import { Component, Input } from "@angular/core";
import usa from "devextreme/dist/js/vectormap-data/usa.js";
import world from "devextreme/dist/js/vectormap-data/world.js";
import { scaleThreshold } from 'd3-scale';

@Component({
  selector: "app-vector-map-component",
  templateUrl: "./vector-map.component.html",
  styleUrls: ["./vector-map.component.css"]
})
export class VectorMapComponent1 {
  @Input() data: any[] = [];
  @Input() min = 0;
  @Input() max = 0;
  @Input() countField;
  @Input() mapClass: 'minimap' | 'vector-map' = 'vector-map';
  states: any = usa.usa;
  world: any = world.world;
  countScale: Function;
  palleteColors = ['#17a2b8', '#4db49f', '#85c17f', '#bfc657', '#ffc107', '#ff9931', '#fc7542', '#f95450', '#f5365c'];
  inited: boolean;

  constructor() {
    this.customizeTooltip = this.customizeTooltip.bind(this);
    this.customizeLayers = this.customizeLayers.bind(this);
    this.customizeStateLayers = this.customizeStateLayers.bind(this);
    this.click = this.click.bind(this);
  }

  pallete(min, max): Function {
    const d = (max-min)/9;
    return scaleThreshold()
        .range(this.palleteColors)
        .domain([min + d*1,min + d*2,min + d*3,min + d*4,min + d*5,min + d*6,min + d*7,min + d*8]);
  }

  customizeTooltip(arg) {
    let name = arg.attribute("name");
    return {
      text: name,
      color: "#FFFFFF",
      fontColor: "#000"
    };
  }

  customizeLayers(elements) {
    if(!Array.isArray(this.data)) return;

    if(this.data && this.countField && !this.max){
      const max = this.data[0];
      if(max){
        this.max  = max[this.countField];
      }
    }

    this.countScale = this.pallete(this.min, this.max);
    const countries = this.data ? this.data.filter(x => !x.state) : [];

    elements.forEach(element => {
      let country = countries && countries.find(x => x.country === element.attribute("name"));
      if (country) {
        element.applySettings({
          color: this.countScale(country[this.countField])
        })
      } else {
        element.applySettings({
          color: "#e4e4e4",
          hoveredColor: "#e4e4e4",
          selectedColor: "#e4e4e4"
        });
      }
    });
  }

  customizeStateLayers(elements) {
    if(!Array.isArray(this.data)) return;
    
    if(this.data && this.countField && !this.max){
      const max = this.data[0];
      if(max){
        this.max  = max[this.countField];
      }
    }

    this.countScale = this.pallete(this.min, this.max);
    const states = this.data ? this.data.filter(x => x.state) : []
    elements.forEach(element => {
      let country = states && states.find(x => x.state === element.attribute("name"));
      if (country) {
        element.applySettings({
          color: this.countScale(country[this.countField])
        })
      } else {
        element.applySettings({
          color: "#e4e4e4",
          hoveredColor: "#e4e4e4",
          selectedColor: "#e4e4e4"
        });
      }
    });
  }

  click(e) {
    let target = e.target;
    // if (target && this.countries[target.attribute("name")]) {
    //   target.selected(!target.selected());
    // }
  }
}
