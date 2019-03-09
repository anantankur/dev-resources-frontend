import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import MainSidebar from './components/sideNav/mainSidebar';
import Resource from './containers/resource';
import Home from './containers/home';
import User from './containers/user';
import Dashboard from './containers/dashboard';
import NotFound from './containers/404';
import './App.css'
import About from './containers/about';

// Listens for URL Changes
const history = createBrowserHistory();

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      route: ``,
      hoken: ``,
      isSignedIn: false,
      display: `masonry`,
      backendBaseURL: 'https://dev-resources.herokuapp.com',
      frontendBaseURL: window.location.hostname,
      userId: 179604866807627777,
      contribs: []
    }
  }

  componentDidMount() {
    if (localStorage.getItem("display") === null) this.setState({ display: "tableview" })
    else this.setState({ display: localStorage.getItem("display") })

    if(localStorage.getItem('hoken')) this.setState({isSignedIn: true})
    else this.setState({isSignedIn: false})

    fetch(`${this.state.backendBaseURL}/resource/all`)
      .then(response => response.json())
      .then(resourceData => { this.setState({ resources: resourceData }) });
    this.routeHandler()

    this.contribs()

  }

  contribs = async () => {
    await fetch(`${this.state.backendBaseURL}/contributors`)
      .then(response => response.json())
      .then(async (data) => {
        let contributions = [];
        await data.front.forEach(c => {
          contributions[c.login] = { name: c.login, avatar: c.avatar_url, fContribs: c.contributions, url: c.html_url }
        });

        await data.back.forEach(c => {
          if (contributions[c.login]) contributions[c.login]["bContribs"] = c.contributions;
          else contributions[c.login] = { name: c.login, avatar: c.avatar_url, bContribs: c.contributions, url: c.html_url }
        })

        return contributions
      }).then(abx => this.setState({contribs: abx}))
  }

  componentDidUpdate() {
    history.listen((location, action) => {
      this.routeHandler()
    });
  }

  tokenUpdater = (key) => {
      this.setState({hoken: key})
  }

  signer = (a) => { // true or false
      if (!a) {
          localStorage.removeItem('hoken');
      }
      this.setState({isSignedIn: a});
  }

  changeDisplayType = (opt) => {
    this.setState({ display: opt })
    localStorage.setItem("display", opt);
  }

  routeHandler = () => {
    const sections = window.location.pathname.slice(1).split("/")
    this.setState({ route: sections[0], path: sections[1] })
  }

  updateUpvotes = (a) => {
    fetch(`${this.state.backendBaseURL}/resource/all`)
      .then(response => response.json())
      .then(resourceData => { this.setState({ resources: resourceData }) });
  }

  displayRoute = () => {

    const routes = [
      {
        path: "",
        container:
          <Home
            resources={this.state.resources}
            onClick={(slug) => this.changeRoute(`/resource/${slug}`)}
            display={this.state.display}
            changeDisplay={(opt) => this.changeDisplayType(opt)}
            userId={this.state.userId}
            updateVotes={(a) => this.updateUpvotes(a)}
          />
      },
      {
        path: "resource",
        container: <Resource res={this.state.resources} id={this.state.path} />
      },
      {
        path: "user",
        container: <User />
      },
      {
        path: "about",
        container: <About data={this.state.contribs} />
      },
      {
        path: "dashboard",
        container: <Dashboard tokenUpdater={this.tokenUpdater} signer={this.signer} isSignedIn={this.state.isSignedIn}/>
      }
    ]
    let matchedRoute = routes.find(route => route.path === this.state.route)
    return matchedRoute ? matchedRoute.container : <NotFound />

  }

  changeRoute = (r) => {
    history.push(r)
  }

  render() {
    return (
      <div className="App">
        <MainSidebar changeRoute={(r) => this.changeRoute(r)}/>
        {this.displayRoute()}
      </div>
    );
  }
}

export default App;
