import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import MainSidebar from './components/sideNav/mainSidebar';
import Resource from './containers/resource';
import Home from './containers/home';
import User from './containers/user';
import Dashboard from './containers/dashboard';
import NotFound from './containers/404';
import './App.css';
import About from './containers/about';

// Listens for URL Changes
const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      route: '',
      hoken: '',
      isSignedIn: false,
      display: `masonry`,
      backendBaseURL: 'https://dev-resources.herokuapp.com',
      frontendBaseURL: window.location.hostname,
      userProfile: {},
      contribs: [],
      selectedResource: {},
      path: ''
    };
  }

  componentDidMount() {
    if (localStorage.getItem('display') === null)
      this.setState({ display: 'tableview' });
    else this.setState({ display: localStorage.getItem('display') });

    if (localStorage.getItem('hoken')) {
        this.setState({ isSignedIn: true, userProfile: JSON.parse(localStorage.getItem('profile')) });
    }
    else this.setState({ isSignedIn: false, userProfile: {} });

    fetch(`${this.state.backendBaseURL}/resource/all`)
      .then(response => response.json())
      .then(resourceData => {
        this.setState({ resources: resourceData.payload.resources });
      });
    this.routeHandler();

    this.contribs();
  }

  contribs = async () => {
    await fetch(`${this.state.backendBaseURL}/contributors`)
      .then(response => response.json())
      .then(contribs => this.setState({ contribs: contribs }));
  };

  componentDidUpdate() {
    history.listen((location, action) => {
      this.routeHandler();
    });
  }

  tokenUpdater = key => {
    this.setState({ hoken: key });
  };

  signer = a => {
    if (!a) {
      localStorage.removeItem('hoken');
      localStorage.removeItem('uid');
      localStorage.setItem('profile', '');
    }
    this.setState({ isSignedIn: a });
  };

  changeDisplayType = opt => {
    this.setState({ display: opt });
    localStorage.setItem('display', opt);
  };

  routeHandler = () => {
    const sections = window.location.pathname.slice(1).split('/');
    this.setState({ route: sections[0], path: sections[1] });
  };

  onClick = (slug, index) => {
    this.setState({ selectedResource: this.state.resources[index] });
    this.changeRoute(`/resource/${slug}`);
  };

  updateUpvotes = a => {
    fetch(`${this.state.backendBaseURL}/resource/all`)
      .then(response => response.json())
      .then(resourceData => {
          console.log(resourceData);
        this.setState({ resources: resourceData.payload.resources });
      });
  };

  displayRoute = () => {
    const routes = [
      {
        path: '',
        container: (
          <Home
            resources={this.state.resources}
            onClick={(slug, index) => this.onClick(slug, index)}
            display={this.state.display}
            changeDisplay={opt => this.changeDisplayType(opt)}
            updateVotes={a => this.updateUpvotes(a)}
          />
        )
      },
      {
        path: 'resource',
        container: <Resource res={this.state.selectedResource} />
      },
      {
        path: 'user',
        container: <User />
      },
      {
        path: 'about',
        container: <About data={this.state.contribs} />
      },
      {
        path: 'dashboard',
        container: (
          <Dashboard
            tokenUpdater={this.tokenUpdater}
            signer={this.signer}
            isSignedIn={this.state.isSignedIn}
          />
        )
      }
    ];
    let matchedRoute = routes.find(route => route.path === this.state.route);
    return matchedRoute ? matchedRoute.container : <NotFound />;
  };

  changeRoute = r => {
    history.push(r);
  };

  render() {
    return (
      <div className="App">
        <MainSidebar changeRoute={r => this.changeRoute(r)} />
        {this.displayRoute()}
      </div>
    );
  }
}

export default App;
