import axios from "axios";
import React, { Component } from 'react';
import { Button, Card, Container } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { API } from "../utils/constants";
import LoadingAnimation from '../widgets/loadingView';
import MovieSidePanel from "../widgets/movieSidePanel";
import EmotionInput from "../widgets/emotionInput";
import EmotionViz from "../widgets/emotionsViz";


class RecommendationPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            leftPanel: { items: [], condition: '', byline: '', tag: '' },
            rightPanel: { items: [], condition: '', byline: '', tag: '' },
            visited: [],
            setIsShown: false,
            activeMovie: null,
            pick: this.props.pick || false,
            recDateTime: new Date(),
            pageid: 5,
            ratings: this.props.location.state.ratings,
            userid: this.props.location.state.userid,
            updateSuccess: false,
            selectedid: undefined
        };
        this.handleHover = this.handleHover.bind(this);
        this.handleRating = this.handleRating.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.updateSurvey = this.updateSurveyResponse.bind(this);
    }

    componentDidMount() {
        this.props.toggleLoader(true);
        this.getRecommendations();
        this.startTimer();
        if (this.state.pick) {
            document.body.style.backgroundColor = "blanchedalmond";
        }
    }

    getRecommendations() {
        let userid = this.state.userid;
        let ratings = this.state.ratings;

        axios.post(API + 'recommendations', {
            userid: userid,
            ratings: ratings
        },
            {
                headers: {
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        leftPanel: {
                            tag: response.data['recommendations']['left']['tag'],
                            condition: response.data['recommendations']['left']['label'],
                            byline: response.data['recommendations']['left']['byline'],
                            items: response.data['recommendations']['left']['items']
                        },
                        rightPanel: {
                            tag: response.data['recommendations']['right']['tag'],
                            condition: response.data['recommendations']['right']['label'],
                            byline: response.data['recommendations']['left']['byline'],
                            items: response.data['recommendations']['right']['items']
                        }
                    });
                }
            });
    }

    async startTimer() {
        // await this.wait(10000);
        this.setState({
            ready: true
        });
        this.props.toggleLoader(false);
    }

    wait(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }

    updateSurveyResponse() {
        let recDateTime = this.state.recDateTime;
        let recEndTime = new Date();
        let pageid = this.state.pageid;
        let userid = this.state.userid;
        let ratedLst = this.state.visited;

        axios.put(API + 'add_survey_response', {
            pageid: pageid,
            userid: userid,
            starttime: recDateTime.toUTCString(),
            endtime: recEndTime.toUTCString(),
            response: { ratings: ratedLst }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        updateSuccess: true
                    });
                }
                this.props.progressUpdater(10);
            })
    }

    handleHover(isShown, activeMovie) {
        this.setState({
            setIsShown: isShown,
            activeMovie: activeMovie
        });
    }

    /**
     * TODO Split up the vstdLst into separate list to keep track
     * Update rating on each panel separately
     * @param {string} panelid refers to the id of the MovieSidePanel for callback
     * @param {int} newRating the user updated rating for a movie
     * @param {string} movieid the id of the movie to be updated
     */
    handleRating(panelid, newRating, movieid) {
        let panel = this.state[panelid];
        let movieLst = [...panel.items];
        let vstdLst = [...this.state.visited];
        let ratedItm = movieLst.map(movie => (
            movie.movie_id === movieid ? {
                ...movie, rating: newRating
            } : movie
        ));
        let isNew = !vstdLst.some(item => item.item_id === movieid);
        if (isNew) {
            vstdLst.push({
                "item_id": movieid,
                "rating": newRating,
                "loc": panel.tag,
                "level": this.props.level
            });
        } else {
            vstdLst = vstdLst.map(movie => (
                movie.item_id === movieid ? {
                    ...movie, rating: newRating
                } : movie
            ));
        }
        panel.items = ratedItm;
        this.setState({
            panelid: panel,
            visited: vstdLst
        });
    }

    handleSelect(movieid) {
        this.setState({
            selectedid: movieid
        });
    }

    render() {
        let pick = this.state.pick;
        let selectedid = this.state.selectedid;

        let userid = this.state.userid;
        let ratings = this.state.visited.concat(this.state.ratings);

        let leftItems = this.state.leftPanel.items;
        let leftCondition = this.state.leftPanel.condition;
        let leftbyline = this.state.leftPanel.byline;

        if (this.state.updateSuccess) {
            return (
                <Redirect to={{
                    pathname: this.props.dest,
                    state: {
                        userid: userid,
                        ratings: ratings,
                        recs: leftItems
                    }
                }} />
            );
        }


        let rightItems = this.state.rightPanel.items;
        let rightCondition = this.state.rightPanel.condition;
        let rightbyline = this.state.rightPanel.byline;

        let buttonDisabled = ((leftItems.length) !==
            this.state.visited.length) && selectedid === undefined;

        let buttonVariant = buttonDisabled ? 'secondary' : 'primary';

        return this.state.ready ? (
            <>
                <div className="jumbotron">
                    <h1 className="header">{this.props.pageHeader}</h1>
                    <p>{this.props.headerSubtitle}
                    </p>
                </div>

                <div className="row g-0">
                    <MovieSidePanel id="leftPanel" movieList={leftItems} hoverHandler={this.handleHover}
                        ratingHandler={this.handleRating} panelTitle={leftCondition} pick={pick}
                        selectionHandler={this.handleSelect} selectedid={selectedid}
                        panelByline={leftbyline} />
                    <div className="col-sm-4 gx-sm-4">
                        {/* The Hover Block - Only activates when hovered */}
                        {this.state.setIsShown && (this.state.activeMovie != null) ? (
                            <Card bg="dark" text="white" style={{
                                backgroundColor: '#333', borderColor: '#333'
                            }}>
                                <Card.Body style={{ height: '360px' }}>
                                    <Card.Img variant="top" className="d-flex mx-auto d-block img-thumbnail"
                                        src={this.state.activeMovie.poster} alt={"Poster of the movie " +
                                            this.state.activeMovie.title}
                                        style={{ maxHeight: "63%", minHeight: "63%", width: "auto" }} />
                                    <Card.Title style={{ marginTop: "0.5rem" }}>
                                        {this.state.activeMovie.title}
                                    </Card.Title>
                                    <Container className="overflow-auto" style={{ height: "30%" }}>
                                        <Card.Text>
                                            {this.state.activeMovie.description}
                                        </Card.Text>
                                    </Container>
                                </Card.Body>
                            </Card>
                        ) : (<div />)
                        }
                        {/* The Hover Block Ends */}
                        <div style={{marginTop: "9px"}}>
                            <Card bg="light" text="black" style={{
                                backgroundColor: '#333', borderColor: '#333'
                            }}>
                                <Card.Body style={{ height: '360px' }}>
                                    <Card.Title style={{ marginTop: "0.5rem" }}>
                                        {"Explanation"}
                                    </Card.Title>
                                    <Container className="overflow-auto" style={{ height: "30%" }}>
                                        <Card.Text>
                                            {"Random text ............."}
                                        </Card.Text>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>



                    <div className="col-sm-4 gy-sm-0">
                        <EmotionViz />
                        <EmotionInput />
                    </div>
                </div>
                <div className="jumbotron jumbotron-footer">
                    <Button className="footer-btn" variant={buttonVariant} size="lg"
                        disabled={buttonDisabled}
                        onClick={this.updateSurvey}>
                        Next
                    </Button>
                </div>
            </>
        ) :
            (
                <>
                    <LoadingAnimation waitMsg={this.props.waitMsg}></LoadingAnimation>
                </>
            );
    }
}

export default RecommendationPage;