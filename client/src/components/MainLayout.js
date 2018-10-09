import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InvertColors from "@material-ui/icons/InvertColors";
import axios from "axios";
import React, { Component } from "react";
import Credits from "./Credits";
import IPCard from "./IPCard";
import Loading from "./Loading";
import MapComp from "./MapComp";
import RecipeCard from "./RecipeCard";

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {
        ip: "127.0.0.1",
        language: "en-GB,en-US;q=0.9,en;q=0.8",
        software:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36"
      },
      loading: true,
      location: null,
      mapTheme: false,
      error: null,
      pos: null
    };

    this.getIP = this.getIP.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.changeMapTheme = this.changeMapTheme.bind(this);
  }

  getIP = () => {
    axios.get("http://localhost:5000/api/").then(x => {
      this.setState({
        cardData: x
      });
      this.getLocation(x.ip);
    });

    this.getLocation("8.8.8.8");
  };

  getLocation(ipAddr) {
    axios
      .get(`https://ipapi.co/${ipAddr}/json/`)
      .then(resp => {
        // console.log(resp.data);
        this.setState({
          location: resp.data,
          loading: false,
          error: false,
          pos: {
            lat: resp.data.latitude,
            lng: resp.data.longitude
          }
        });
        // console.log(this.state);
      })
      .catch(err => {
        this.setState({
          error: `${err}`,
          loading: false
        });
      });
    // this.pos = [this.state.location.latitude, this.state.location.longitude];
  }

  changeMapTheme() {
    this.setState({
      mapTheme: !this.state.mapTheme
    });

    console.log(this.state.mapTheme);
  }

  componentDidMount() {
    this.getIP();
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }

    if (!loading) {
      return (
        <div>
          <Grid container className="root">
            <Grid item sm={1} className="darker">
              <IPCard cardData={this.state.cardData} />
              <RecipeCard
                className="small-margins"
                location={this.state.location}
                cardData={this.state.cardData}
              />
              <Credits />
              <Button
                variant="fab"
                color="secondary"
                className="fabButton"
                onClick={() => this.changeMapTheme()}
              >
                <InvertColors />
              </Button>
            </Grid>
            <Grid item sm={11} className="deep-back">
              <MapComp
                location={this.state.pos}
                mapTheme={this.state.mapTheme}
              />
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}
