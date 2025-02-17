import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import SidePanelItem from './movieSidePanelItem';

class MovieSidePanel extends Component {

	changeRating = (newRating, movieid) => {
		let panelid = this.props.id;
		this.props.ratingHandler(panelid, newRating, movieid);
	}

	onValueChange = (event) => {
		let panelid = this.props.id;
		let movieid = event.target.value;
		this.props.selectionHandler(panelid, movieid);
	}

	onHover = (evt, isShown, activeMovie, action) => {
		let panelid = this.props.id;
		this.props.hoverHandler(isShown, activeMovie, action, panelid);
	}

	render() {
		return (
			<div className="col-sm-4 gy-sm-0" id={this.props.id}>
				<div className="align-items-center justify-content-center"
					style={{
						height: "108px", padding: "27px 18px",
						textAlign: "center", borderRadius: "0.3rem 0.3rem 0 0",
						backgroundColor: "#e9ecef"
					}}>
					<h5>{this.props.panelTitle}</h5>
					<p style={{ textAlign: "left", fontSize: "14px" }}>
						{this.props.panelByline}
					</p>
				</div>
				<ListGroup as="ul">
					{this.props.movieList.map((movie) => (
						<SidePanelItem key={movie.movie_id} movie={movie}
							pick={this.props.pick || false}
							selectedid={this.props.selectedid}
							hoverHandler={this.onHover}
							ratingsHandler={this.changeRating}
							selectStateHandler={this.onValueChange} />
					))}
				</ListGroup>
			</div>
		);
	}
}

export default MovieSidePanel