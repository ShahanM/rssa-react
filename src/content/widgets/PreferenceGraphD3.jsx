import React, { Component } from 'react';
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MoviePosterIcon from './moviePosterIcon';
import * as d3 from 'd3';
import axios from "axios";
import { API } from '../utils/constants';

class PreferenceGraphD3 extends Component {

	constructor(props) {
		super(props)

		this.state = {
			data: [],
			width: 800,
			height: 800
		}
	}

	createLogoDefs() {
		// Setup
		let logoRadius = 72;
		let graphData = this.state.data;

		const svg = d3.select('#mySvg');
		const logoDefs = svg.select('defs.logoDefs');

		graphData.forEach(d => {
			let teamImgSrc = d.poster;
			logoDefs.append('svg:pattern')
				.attr('id', `teamlogo-${d.item_id}`)
				.attr('width', logoRadius)
				.attr('height', logoRadius)
				.attr('patternUnits', 'userSpaceOnUse')
				.append('svg:image')
				.attr('xlink:href', teamImgSrc)
				.attr('width', logoRadius)
				.attr('height', logoRadius)
				.attr('x', 0)
				.attr('y', 0);
		});
	}

	getData() {
		// We prefetch the next page; every query is two pages of items
		axios
			.get('http://192.168.0.21:5001/disc_cont_coupled')
			.then(response => {
				let dataWidth = Math.max.apply(Math, response.data.map(d => d.user_score));
				let dataHeight = Math.max.apply(Math, response.data.map(d => d.community_score));
				this.setState({
					data: response.data,
					width: dataWidth*100*2+100,
					height: dataHeight*100+100
				});
				this.createLogoDefs();
				this.drawGraph();
			})
			.catch(error => {
				console.log(error);
			});
	}

	drawGraph() {
		let width = this.state.width;
		let height = this.state.height;
		// let graphData = [
		// 	{ teamId: 'DUKE', x: 25, y: 35 },
		// 	{ teamId: 'UNC', x: 125, y: 50 },
		// 	{ teamId: 'UVA', x: 225, y: 100 },
		// 	{ teamId: 'TTU', x: 225, y: 35 }];
		let data = this.state.data;
		console.log(data[0], (d) => d.user_score*100);
		const xScale = d3.scaleTime()
			.domain([
				d3.min(data, (d) => d.user_score*100*2) - 100,
				d3.max(data, (d) => d.user_score*100*2) + 100
			])
			.range([0, width]);
		const yScale = d3.scaleLinear()
			.domain([
				d3.min(data, (d) => d.community_score*100) - 100,
				d3.max(data, (d) => d.community_score*100) + 100
			])
			.range([height, 0]);

		let graphData = this.state.data;

		console.log(graphData);

		let svg = d3.select('#mySvg');
// 		svg.append("g")
//     .classed('y', true)
//     .classed('grid', true)
//     .call(yAxisGrid);

// svg.append("g")
//     .classed('x', true)
//     .classed('grid', true)
//     .call(xAxisGrid);

		// const svg = svgEl
		// .append("g")
		// .attr("transform", `translate(${margin.left},${margin.top})`);

		const xAxis = d3.axisBottom(xScale)
			.ticks(10)
			.tickSize(-height-18);
		const xAxisGroup = svg.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis);
		xAxisGroup.select(".domain").remove();
		xAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.6)");
		xAxisGroup.selectAll("text")
			.attr("opacity", 0.5)
			.attr("color", "black")
			.attr("font-size", "0.75rem");
		// Add Y grid lines with labels
		const yAxis = d3.axisLeft(yScale)
			.ticks(10)
			.tickSize(-width-18)
			.tickFormat((val) => `${val}%`);
		
		const yAxisGroup = svg.append("g").call(yAxis);
		yAxisGroup.select(".domain").remove();
		yAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.6)");
		yAxisGroup.selectAll("text")
			.attr("opacity", 0.5)
			.attr("color", "black")
			.attr("font-size", "0.75rem");
		// Draw the lines
		// const line = d3.line()
			// .x((d) => xScale(d.user_score))
			// .y((d) => yScale(d.community_score));


		const logoMarkers = svg.select('g.points')
			.selectAll('rect')
			.data(graphData, d => d.item_id);

		let logoRadius = 72;
		logoMarkers
			.enter()
			.append('rect')
			.attr('transform', d => `translate(${d.user_score * 100*2}, ${d.community_score * 100})`)
			.attr('x', 0).attr('y', 0)
			.attr('width', logoRadius)
			.attr('height', logoRadius)
			.attr('fill', d => `url(#teamlogo-${d.item_id})`)
			.attr('cursor', 'pointer');
	}

	componentDidMount() {
		this.getData();
	}

	render() {
		let width = this.state.width;
		let height = this.state.height;

		return (
			<svg id="mySvg" width={width+100} height={height+100}>
				<defs className='logoDefs' />
				<g className="points" />
			</svg>
		)
	}
}

export default PreferenceGraphD3;