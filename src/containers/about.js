import React from 'react';

const About = ({ data }) => {
    

    const sortArrayOfObjects = (arr, key) => {
        return arr.sort((a, b) => {
            if (a[key].toLowerCase() < b[key].toLowerCase())
            return -1;
        if (a[key].toLowerCase() > b[key].toLowerCase())
            return 1;
        return 0;
        });
    };
    
    sortArrayOfObjects(data, "username");

    return (
        <div>
            <h1 className="text-white text-center mt-3">About Page</h1>
            <p className="text-white text-center">About page content here</p>

            <h2 className="text-white text-center">Contributors</h2>

            <div className="row mx-5">
                {
                    Object.keys(data).map((user, i) => {
                        console.log(data[user])
                        return (


                            <div className="col-md-3 p-3" >
                                <div className="card cardRes">
                                    <img className="card-img-top img-respsonsive" src={data[user].avatar} alt={data[user].name} />
                                    <div className="card-body ">
                                        <h1>{data[user].username}</h1>
                                        <p className="card-text">{data[user].url.slice(8)}</p>
                                    </div>
                                    <div className="card-footer text-muted">
                                        <div className="row">
                                            <div className="col-md-6 text-left tooltip1">
                                                <div class="tooltiptext">
                                                    <h4>Frontend Contribution</h4>
                                                    <p>Additions: {data[user].frontend.a}</p>
                                                    <p>Deletions: {data[user].frontend.d}</p>
                                                    <p>Contribution: {data[user].frontend.c}</p>
                                                </div>
                                                <i className="fas fa-globe-americas"></i> {data[user].frontend.c}
                                            </div>
                                            <div className="col-md-6 text-right tooltip1">
                                            <div class="tooltiptext text-center">
                                                    <h4>Backend Contribution</h4>
                                                    <p>Additions: {data[user].backend.a}</p>
                                                    <p>Deletions: {data[user].backend.d}</p>
                                                    <p>Contribution: {data[user].backend.c}</p>
                                                </div>
                                                <i className="fas fa-server"></i> {data[user].backend.c}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default About;