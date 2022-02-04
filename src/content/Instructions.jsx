import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-step-progress-bar/styles.css";
import ProgressBarComponent from "./progressBarComponent";


class Instructions extends Component {

	render() {
		let userid = this.props.location.state.userid;
		console.log(userid);

		return (
			<div className="contentWrapper">
				<ProgressBarComponent percentComplete={30}/>
				<br/>
				<div className="instructions-page">
					<div className="row">
						<div className="col-sm">
							<div className="card ">
								<img src="/Preference-rssa.png" className="card-img-top" alt="..."/>
								<div className="card-body">
									<h5 className="card-title"> Select Preferences</h5>
									<p className="card-text">
										Rate movies for the system to learn about your
										preferences. You can select "Get another option" to get a new movie option.
									</p>
								</div>
							</div>
						</div>
						<div className="col-sm">
							<div className="card">
								<img src="/recommendation-rssa.png" className="card-img-top" alt="..."/>
								<div className="card-body">
									<h5 className="card-title">Rate Recommendations</h5>
									<p className="card-text">
										The system will provide recommendations and for each
										you will be asked to rate the recommendation.
									</p>
								</div>
							</div>
						</div>
						<div className="col-sm">
							<div className="card">
								<img src="/survey-rssa.png" className="card-img-top" alt="..."/>
								<div className="card-body">
									<h5 className="card-title">Complete Survey</h5>
									<p className="card-text">
										Lastly, you will be asked to complete a survey about
										your experience interacting with the system.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style={{marginTop: "1em"}}>
					<Link to= {{
						pathname: "/pref",
						state: {
							userid: userid
						}
					}}>
						<Button variant="primary" size="lg" style={{float: 'right'}}>
							Next
						</Button>
					</Link>
				</div>
			</div>
		);
	}
}

export default Instructions;