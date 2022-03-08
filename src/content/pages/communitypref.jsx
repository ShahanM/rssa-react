import React, { Component } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PreferenceGraph from '../widgets/preferenceGraph';
import PreferenceGraphD3 from '../widgets/PreferenceGraphD3';
import PreferenceSidebar from '../widgets/preferenceSideBar';


class CommunityPreference extends Component {

	render() {

		let movies = this.props.location.state.movies;
		let ratings = this.props.location.state.ratings;
		// console.log(movies);
		// console.log(ratings);

		return (
			<>
				<div className="jumbotron">
					<h1 className="header">Rating Movies</h1>
					<p> Rate {this.moviesRatingCount} movies from the gallery below.</p>
				</div>
				<Row className="g-0">
					<Col sm={8}>
						<PreferenceGraphD3 ratings={ratings} movies={movies}></PreferenceGraphD3>
					</Col>
					<Col sm={4}>
						<PreferenceSidebar></PreferenceSidebar>
					</Col>
				</Row>
				<div className="jumbotron jumbotron-footer">
					<Link to="/exit">
						<Button className="footer-btn" variant="primary" size="lg">
							Next
						</Button>
					</Link>
				</div>
			</>
		);
	}
}


export default CommunityPreference;