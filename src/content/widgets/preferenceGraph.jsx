import React, { Component } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MoviePosterIcon from './moviePosterIcon';

const data = [
	{ x: 100, y: 200, z: 200 },
	{ x: 120, y: 100, z: 260 },
	{ x: 170, y: 300, z: 400 },
	{ x: 140, y: 250, z: 280 },
	{ x: 150, y: 400, z: 500 },
	{ x: 110, y: 280, z: 200 },
];


class PreferenceGraph extends Component {


	render() {
		console.log(this.props.movies);
		console.log(this.props.ratings);
		let movies = this.props.movies.map((movie) => ({
			...movie,
			x: movie.rating,
			y: movie.aveRating/2
		}));


		return (
			<ResponsiveContainer width="100%" height="100%">
				<ScatterChart
					style={{width: "603px", height: "400px"}}
					margin={{
						top: 20,
						right: 20,
						bottom: 20,
						left: 20,
					}}
				>
					<CartesianGrid />
					<XAxis type="number" dataKey="x" name="Your Ratings" unit="" />
					<YAxis type="number" dataKey="y" name="Community Ratings" unit="" />
					<Tooltip cursor={{ strokeDasharray: '3 3' }} />
					<Scatter name="Movies" data={movies} fill="#8884d8" shape={<MoviePosterIcon />} />
				</ScatterChart>
			</ResponsiveContainer>
		);
	}
}

export default PreferenceGraph;