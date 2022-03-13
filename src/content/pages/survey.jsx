import axios from 'axios';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import SurveyPane from '../widgets/surveyPanes';
import { qBank, likertVals, API } from '../utils/constants';
import { Redirect } from 'react-router-dom';
import { withMousePositionHook } from "../hooks/useMousePosition";

import ReactHtmlParser from 'react-html-parser';


class SurveyPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userid: props.location.state.userid,
			pickid: props.location.state.selectedid,
			finalRecommendations: props.location.state.recs,
			pageid: 8,
			surveyPageCount: 6,
			currentStep: 1,
			surveyDateTime: new Date(),
			disabled: true,
			responses: [],
			seen_set: [],
			done: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.updateSurvey = this.updateSurveyResponse.bind(this);
	}

	updateSurveyResponse() {
		let currentStep = this.state.currentStep;
		let surveyPageCount = this.state.surveyPageCount;

		let surveyDateTime = this.state.surveyDateTime;
		let surveyEndTime = new Date();
		let pageid = this.state.pageid + currentStep - 1;
		let userid = this.state.userid;
		let responses = this.state.responses;



		axios.put(API + 'add_survey_response', {
			starttime: surveyDateTime.toUTCString(),
			endtime: surveyEndTime.toUTCString(),
			pageid: pageid,
			userid: userid,
			response: { responses: responses }
		},
			{
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(response => {
				if (response.status === 200) {
					if (surveyPageCount === currentStep) {
						this.setState({
							done: true
						});
						this.props.progressUpdater(100);
					} else {
						this._next();
						this.props.progressUpdater();
					}
				}
			})
	}

	handleChange(event, qId, qText, likertVal, numQuestions) {
		let responses = this.state.responses;
		let response = {};

		if (!responses.some(res => res.id === qId)) {
			response = {
				id: qId,
				text: qText,
				val: likertVals.indexOf(likertVal) + 1
			};
			responses.push(response);
		} else {
			responses = responses.map(res => (
				res.id === qId ? {
					...res, val: likertVals.indexOf(likertVal) + 1
				} : res
			));
		}

		this.setState({
			responses: responses,
			disabled: !(responses.length === numQuestions)
		})
	}


	/*
	functions to handle next and previous buttons 
	*/
	_next = () => {
		let currentStep = this.state.currentStep;
		let surveyDateTime = new Date();
		let responses = [];
		currentStep++;
		this.setState({
			currentStep: currentStep,
			disabled: true,
			surveyDateTime: surveyDateTime,
			responses: responses
		});
	}

	nextButton() {
		const currentStep = this.state.currentStep;
		let buttonVariant = this.state.disabled ? 'secondary' : 'primary';
		if (currentStep < 6) {
			return (
				<Button disabled={this.state.disabled}
					className="footer-btn"
					variant={buttonVariant} size="lg" onClick={this.updateSurvey}>
					Next
				</Button>
			);
		} else {
			return (
				<Button disabled={this.state.disabled}
					className="footer-btn"
					variant={buttonVariant} size="lg" onClick={this.updateSurvey}>
					Submit
				</Button>
			);
		}
	}

	getQuestions(idx) {
		return qBank[idx];
	};

	render() {
		let maxPanes = this.state.surveyPageCount;
		let currentStep = this.state.currentStep;
		let userid = this.state.userid;
		let done = this.state.done;
		let qSet = this.getQuestions(currentStep);
		let pageid = this.state.pageid;

		const mousePos = this.props.mousePositionHook;
		const pageHeight = document.body.scrollHeight;
		const pageWidth = document.body.scrollWidth;

		if (done) {
			this.props.activitySync(mousePos, pageHeight, pageWidth, userid, pageid);
			return (
				<Redirect to={{
					pathname: "/exit",
					state: {
						completed: done,
						userid: userid
					}
				}} />
			)
		}

		return (
			<>
				<div className="jumbotron">
					<h4>{qSet.title}</h4>
					<p>{ReactHtmlParser(qSet.instruction)}</p>
				</div>
				<div className="survey-page">
					<SurveyPane
						maxPanes={maxPanes}
						key={currentStep}
						currentStep={currentStep}
						handleChange={this.handleChange}
						stepFlag={currentStep}
						questions={qSet} />
					<div className="jumbotron jumbotron-footer">
						{this.nextButton()}
					</div>
				</div>
			</>
		);
	}
}

export default withMousePositionHook(SurveyPage);