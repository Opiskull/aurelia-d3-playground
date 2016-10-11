import { inject, bindable, BindingEngine } from "aurelia-framework";
import * as d3Scale from "d3-scale";
import * as d3Selection from "d3-selection";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis"
import moment from 'moment'

@inject(Element, BindingEngine)
export class Calendar implements Chart {
    @bindable selectedDate: Date = new Date();
    @bindable events: CalendarEvent[] = [];

    private eventChangedSubscription;

    public eventsChanged() {
        if(this.eventChangedSubscription != null){
            this.eventChangedSubscription.dispose();
        }
        this.eventChangedSubscription = this.bindingEngine.collectionObserver(this.events).subscribe(this.eventsChanged.bind(this));
        this.render(750, 500)
    }



    constructor(private element: Element, private bindingEngine: BindingEngine) {
        window.onresize = () => {
            this.render(750, 500)
        }
        //let subscription = this.bindingEngine.collectionObserver(this.events).subscribe(this.eventsChanged);
    }

    public render(totalWidth: number, totalHeight: number) {
        let margin = { top: 20, right: 40, bottom: 20, left: 280 };
        let height = totalHeight - margin.top - margin.bottom;
        let width = totalWidth - margin.left - margin.right;

        d3Selection.select(this.element).select("svg").text(null);

        let x_scale = d3Scale.scaleLinear()
            .domain([1, moment(this.selectedDate).daysInMonth()])
            .range([0, width]);

        let y_scale = d3Scale.scaleLinear()
            .domain([0, this.events.length])
            .range([0, height])

        let svg = d3Selection
            .select(this.element)
            .select("svg")
            .attr("width", totalWidth)
            .attr("height", totalHeight)
            .attr("viewBox", "0 0 " + totalWidth + " " + totalHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x_axis = svg
            .append("g")
            .attr("class", "axis")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .call(d3Axis.axisTop(x_scale).ticks(30));

        let bars = svg
            .append("g")
            .attr("class", "bars")
            .selectAll("rect")
            .data(this.events)
            .enter()
            .append("rect")
            .attr("x", d => x_scale(d.since))
            .attr("y", (d, i) => y_scale(i))
            .attr("width", d => x_scale(d.until - d.since + 1))
            .attr("height", (height / this.events.length) - 2)
            .attr("class", "bar")
            .attr("data-id", (d) => d.id);

        let barTexts = svg
            .append("g")
            .attr("class", "bar-texts")
            .selectAll("text")
            .data(this.events)
            .enter()
            .append("text")
            .attr("x", d => x_scale(d.until) + 2)
            .attr("y", (d, i) => y_scale(i) + 8)
            .attr("class", "bar-text")
            .text((d, i) => d.until - d.since);

        let barValues = svg.append("g")
            .selectAll("text")
            .data(this.events)
            .enter()
            .append("text")
            .attr("x", d => -5)
            .attr("y", (d, i) => y_scale(i) + ((height / this.events.length))/2)
            .attr("class", "bar-owner")
            .style("text-anchor", "end")
            .text((d, i) => d.id);
    }

    attached() {
        this.render(750, 500);
    }

    click(event) {
        if (event.target && event.target.attributes && event.target.attributes["data-id"]) {
            alert(event.target.attributes["data-id"].value);
        }
    }
}

export class CalendarEvent {
    constructor(public since: number, public until: number, public id: string) {

    }
}

export interface Chart {
    render(width: number, height: number)
}