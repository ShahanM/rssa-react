import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";

class EmotionViz extends Component {

	changeRating = (newRating, movieid) => {
		let panelid = this.props.id;
		this.props.ratingHandler(panelid, newRating, movieid);
	}

	onValueChange = (event) => {
		let movieid = event.target.value;
		this.props.selectionHandler(movieid);
	}

	render() {
		return (
			<div>
				<div className="align-items-center justify-content-center"
					style={{
						height: "63px", padding: "27px 18px",
						textAlign: "center", borderRadius: "0.3rem 0.3rem 0 0",
						backgroundColor: "#e9ecef"
					}}>
					<h5>{"Emotion Dimensions"}</h5>
					<p style={{ textAlign: "left", fontSize: "14px" }}>
						{"random text"}
					</p>
				</div>
				<ListGroup as="ul">
					{['Emotion1', 'Emotion2', 'Emotion3'].map((emotion) => (
						<ListGroup.Item as="li" className="list-group-item">
							{emotion} this is a bar
						</ListGroup.Item>
					)
					)}
				</ListGroup>
			</div>
		);
	}
}

export default EmotionViz;