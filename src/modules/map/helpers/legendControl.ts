import {Feature} from "maplibre-gl";

export interface ChoroplethLegendControlOptions {
  title: string;
  layerId: string;
  colorScale: string[];
  limits: number[];
}

export class ChoroplethLegendControl {
  private _options: ChoroplethLegendControlOptions;
  private _container: HTMLDivElement;
  private _map?: maplibregl.Map;
  // @ts-ignore
  private _paint?: any;
  private title: string;
  private mousemove: (e:any) => void;
  private mouseleave: () => void;
  // @ts-ignore
  private _activeRange: string;
  // @ts-ignore
  private _selectedFeature: Boolean;

  constructor(options: ChoroplethLegendControlOptions) {
    //@ts-ignore
    this.title = options.title || "";
    this._options = { ...options };
    this._container = document.createElement("div");
    this._container.classList.add("maplibregl-ctrl");
    this._container.classList.add("maplibregl-ctrl-choropleth");
    this.mousemove = this._mousemove.bind(this);
    this.mouseleave = this._mouseleave.bind(this);
  }

  onAdd(map: maplibregl.Map): HTMLDivElement {
    this._map = map;
    const layer = this._map.getLayer(this._options.layerId);
    if (layer) {
      this._paint = this._map.getPaintProperty(this._options.layerId, 'fill-color');
      const labels: string[] = [];
      const colorScaleLength = this._options.colorScale.length;
      for (let i = 0; i < colorScaleLength; i++) {
        if (i < colorScaleLength - 1) {
          labels.push(
            `<li><span style="background-color: ${this._options.colorScale[i]}"></span><label>${this._options.limits[i].toLocaleString()} &mdash; ${this._options.limits[i + 1].toLocaleString()}</label></li>`
          );
        } else {
          labels.push(
            `<li><span style="background-color: ${this._options.colorScale[i]}"></span><label>${this._options.limits[i].toLocaleString()} +</label></li>`
          );
        }
      }

      this._container.innerHTML = `
        <h3>Number of ${this.title}<label></label></h3>
        <ul style="list-style-type:none;display:flex">${labels.join('')}</ul>
      `;
      const paintCategories = this._container.querySelectorAll('span');
      //@ts-ignore
      paintCategories.forEach((category, index) => {
        category.addEventListener('mouseover', (event) => this.filterByCategories(event));
        category.addEventListener('mouseleave', (event) => this.cleanFilterByCategories(event));
      });
      this._map.on('mousemove', this._options.layerId, this.mousemove);
      this._map.on('mouseleave', this._options.layerId, this.mouseleave);
    }
    return this._container;
  }

  //@ts-ignore
  private _mousemove(e: any): void {
    // console.log(e.features[0])
    if (e.features[0]?.state?.organization) {
      this.legendHighlight(e.features[0]);
    } else {
      this.clearLegendHighlight();
    }
  }

  private _mouseleave(): void {
    this.clearLegendHighlight();
  }

  legendHighlight(feature: Feature): void {
    if (this._selectedFeature !== feature.id) {
      if (this._map?.getCanvas()) {
        this._map.getCanvas().style.cursor = 'pointer';
      }

      const activeCategories = this._container.querySelector('li.active');
      const headerLabel = this._container.querySelector('h3 > label');
      if (headerLabel) {
        headerLabel.textContent = ` (${feature.properties.name})`;
      }

      if (activeCategories) {
        activeCategories.classList.remove("active");
        const activeLabel = activeCategories.querySelector('label');
        if (activeLabel && this._activeRange !== null) {
          activeLabel.textContent = this._activeRange;
        }
      }

      this._selectedFeature = feature.id;
      //@ts-ignore
      const organization = feature.state.organization;
      const limitIndex = this._options.limits.findIndex(l => l > organization);
      const paintCategories = this._container.querySelectorAll('li');

      const paintCategory = limitIndex > 0
        ? paintCategories[limitIndex - 1]
        : paintCategories[paintCategories.length - 1];

      if (paintCategory) {
        paintCategory.classList.add("active");

        const paintLabel = paintCategory.querySelector('label');
        if (paintLabel) {
          // @ts-ignore
          this._activeRange = paintLabel.textContent ?? null;
          paintLabel.textContent = organization.toLocaleString();
        }
      }
    }
  }

  clearLegendHighlight(): void {
    if (this._map?.getCanvas()) {
      this._map.getCanvas().style.cursor = '';
    }
    // @ts-ignore
    this._selectedFeature = null;

    const activeCategories = this._container.querySelector('li.active');
    const headerLabel = this._container.querySelector('h3 > label');
    if (headerLabel) {
      headerLabel.textContent = "";
    }

    if (activeCategories) {
      activeCategories.classList.remove("active");
      const activeLabel = activeCategories.querySelector('label');
      if (activeLabel && this._activeRange !== null) {
        activeLabel.textContent = this._activeRange;
      }
      // @ts-ignore
      this._activeRange = null;
    }
  }


  //@ts-ignore
  filterByCategories(e){
    const index = [...e.target.parentNode.parentNode.children].indexOf(e.target.parentNode);
    const paint = [...this._paint];
    if(index < this._options.limits.length-1){
      paint[2] = ['case',
        ['all', ['>=', ['feature-state', 'population'], this._options.limits[index]], ['<', ['feature-state', 'population'], this._options.limits[index+1]]],
        this._options.colorScale[index],
        'rgba(0, 0, 0, 0)']
    }else{
      paint[2] = ['case',
        ['>=', ['feature-state', 'population'], this._options.limits[index]],
        this._options.colorScale[index],
        'rgba(0, 0, 0, 0)']
    }
    this._map?.setPaintProperty(this._options.layerId, 'fill-color', paint);
  }

  //@ts-ignore
  cleanFilterByCategories(e){
    this._map?.setPaintProperty(this._options.layerId, 'fill-color', this._paint);
  }

  onRemove(): void {
    if (!this._map || !this._container) {
      return;
    }
    this._map.off('mousemove', this._options.layerId, this.mousemove);
    this._map.off('mouseleave', this._options.layerId, this.mouseleave);
    this._container.parentNode?.removeChild(this._container);
    this._map = undefined;
  }
}
