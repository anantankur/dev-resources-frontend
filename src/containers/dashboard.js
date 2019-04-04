import React, {Component} from 'react';


const urlParams = new URLSearchParams(window.location.search)
const key = urlParams.get('val');
const uid = urlParams.get('uid');
if(key == null) {
    console.log('null');
} else {
    localStorage.setItem("hoken", key);
    localStorage.setItem("uid", uid)
    window.location.href = "https://rustyresources.herokuapp.com/dashboard"
}

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {}
        }
    }

    componentDidMount() {

        fetch('https://rustyresources.herokuapp.com/profile', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                hoken: localStorage.getItem("hoken"),
                uid: localStorage.getItem("uid")
              })
            })
              .then(response => response.json())
              .then(user => {
                if (user.payload.id) {
                    console.log(user.payload);
                    this.props.signer(true);
                    this.setState({profile: user.payload});
                }
              })
    }

    render() {

        const {username, id, avatar, discriminator} = this.state.profile;
        const { signer } = this.props;

        return(
            <div className="App">
                {
                    this.props.isSignedIn
                        ?   <div className="text-center">
                                <h1 className="text-white text-center mt-3">User Page</h1>
                                <p className="text-white text-center">This page will eventually contain your favourite/bookmarked resources and various user options, if you logged in by authenticating with Discord</p>
                                {
                                    this.state.profile.username === undefined
                                        ?   <div>
                                                <h1 className="text-white text-center">Loading ...</h1>
                                                <button type="button" className="btn btn-outline-warning" onClick={() => signer(false)}>Logout</button>
                                            </div>
                                        :   <div>
                                                <h1 className="text-white text-center">{username+'#'+discriminator}</h1>
                                                <button type="button" className="btn btn-outline-warning" onClick={() => signer(false)}>Logout</button>
                                                <hr/>
                                                <img className="text-center" src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png`} alt="avatar" />
                                            </div>
                                }

                            </div>
                        :   <div className="text-center">
                                <h1 className="text-white text-center mt-3">User Page</h1>
                                <p className="text-white text-center">This page will eventually contain your favourite/bookmarked resources and various user options, if you logged in by authenticating with Discord</p>
                                <p >
                                    <a className="btn btn-outline-warning" href='https://discordapp.com/api/oauth2/authorize?client_id=537744904940683277&redirect_uri=https://dev-resources.herokuapp.com/user/auth/discord/callback&response_type=code&scope=identify%20guilds'>login</a>
                                </p>
                            </div>
                }
            </div>

        );

    }

}

export default Dashboard;
